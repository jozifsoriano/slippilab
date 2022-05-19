import createRAF, { targetFPS } from "@solid-primitives/raf";
import { add, dec, pipe } from "rambda";
import { batch, createSignal } from "solid-js";
import { parseReplay } from "./parser/parser";
import { GameSettings, ReplayData } from "./common/types";
import { Highlight, Query, search } from "./search/search";
import {
  action,
  all,
  either,
  isCrouching,
  isDead,
  isGrabbed,
  isInGroundedControl,
  isInHitstun,
  isInShieldstun,
  isOffstage,
  not,
  opponent,
  Predicate,
} from "./search/framePredicates";
import { downloadReplay } from "./supabaseClient";
import { send } from "./workerClient";
import { notificationService } from "@hope-ui/solid";
import { stageNameByExternalId } from "./common/ids";

const [replayData, setReplayData] = createSignal<ReplayData | undefined>();
const [frame, setFrame] = createSignal(0);
const [currentFile, setCurrentFile] = createSignal(-1);
const [currentClip, setCurrentClip] = createSignal(-1);
const [files, setFiles] = createSignal<File[]>([]);
const [clips, setClips] = createSignal<Record<string, Highlight[]>>({});
const [gameSettings, setGameSettings] = createSignal<GameSettings[]>([]);
const [fps, setFps] = createSignal(60);
const [zoom, setZoom] = createSignal(1);
const [framesPerTick, setFramesPerTick] = createSignal(1);
const [isDebug, setIsDebug] = createSignal(false);
const [running, start, stop] = createRAF(targetFPS(tick, fps));
const [parsing, setParsing] = createSignal(false);

export const state = {
  parsing,
  replayData,
  frame,
  currentFile,
  files,
  clips,
  gameSettings,
  currentClip,
  zoom,
  isDebug,
  running,
};

export async function load(files: File[]) {
  notificationService.show({
    loading: true,
    persistent: true,
    title: `Parsing ${files.length} files`,
  });
  const allGameSettings: (GameSettings | undefined)[] = await send(files);
  function isLegalGameWithoutCPUs(
    gameSettings: GameSettings | undefined
  ): boolean {
    if (gameSettings === undefined) return false;
    const stageName = stageNameByExternalId[gameSettings.stageId];
    if (
      ![
        "Battlefield",
        "Fountain of Dreams",
        "Yoshi's Story",
        "Dream Land N64",
        "Pokémon Stadium",
        "Final Destination",
      ].includes(stageName)
    ) {
      return false;
    }
    if (
      gameSettings.playerSettings
        .filter(p => p)
        .some(p => p.playerType === 1 || p.externalCharacterId >= 26)
    ) {
      return false;
    }
    return true;
  }
  const workingIndexes = allGameSettings.flatMap((s, i) =>
    isLegalGameWithoutCPUs(s) ? [i] : []
  );
  const workingFiles = files.filter((_, i) => workingIndexes.includes(i));
  const workingGameSettings = allGameSettings.filter(
    (settings, i): settings is GameSettings => workingIndexes.includes(i)
  );
  const failingFiles = files.filter((_, i) => allGameSettings[i] === undefined);
  notificationService.clear();
  if (failingFiles.length > 0) {
    notificationService.show({
      status: "danger",
      persistent: true,
      title: "Failed to parse",
      description: failingFiles.map(file => file.name).join("\n"),
    });
  }
  try {
    const replayData: ReplayData = parseReplay(
      await workingFiles[0].arrayBuffer()
    );
    const clips = {
      killCombo: search(replayData, ...killComboQuery),
      shieldGrab: search(replayData, ...shieldGrabQuery),
      crouchCancel: search(replayData, ...crouchCancelQuery),
      edgeguard: search(replayData, ...edgeguardQuery),
      grabPunish: search(replayData, ...grabPunishQuery),
    };
    batch(() => {
      setParsing(false);
      setFiles(workingFiles);
      setCurrentFile(0);
      setReplayData(replayData);
      setFrame(0);
      setClips(clips);
      setCurrentClip(-1);
      setGameSettings(workingGameSettings);
    });
    play();
  } catch (e) {}
}

export async function nextFile() {
  const nextIndex = wrap(files().length, currentFile() + 1);
  const replayData = parseReplay(await files()[nextIndex].arrayBuffer());
  const clips = {
    killCombo: search(replayData, ...killComboQuery),
    shieldGrab: search(replayData, ...shieldGrabQuery),
    crouchCancel: search(replayData, ...crouchCancelQuery),
    edgeguard: search(replayData, ...edgeguardQuery),
    grabPunish: search(replayData, ...grabPunishQuery),
  };
  batch(() => {
    setCurrentFile(nextIndex);
    setReplayData(replayData);
    setFrame(0);
    setClips(clips);
    setCurrentClip(-1);
  });
}

export async function previousFile() {
  const previousIndex = wrap(files().length, currentFile() - 1);
  const replayData = parseReplay(await files()[previousIndex].arrayBuffer());
  const clips = {
    killCombo: search(replayData, ...killComboQuery),
    shieldGrab: search(replayData, ...shieldGrabQuery),
    crouchCancel: search(replayData, ...crouchCancelQuery),
    edgeguard: search(replayData, ...edgeguardQuery),
    grabPunish: search(replayData, ...grabPunishQuery),
  };
  batch(() => {
    setCurrentFile(previousIndex);
    setReplayData(replayData);
    setFrame(0);
    setClips(clips);
    setCurrentClip(-1);
  });
}

export async function setFile(fileIndex: number) {
  const replayData = parseReplay(await files()[fileIndex].arrayBuffer());
  const clips = {
    killCombo: search(replayData, ...killComboQuery),
    shieldGrab: search(replayData, ...shieldGrabQuery),
    crouchCancel: search(replayData, ...crouchCancelQuery),
    edgeguard: search(replayData, ...edgeguardQuery),
    grabPunish: search(replayData, ...grabPunishQuery),
  };
  batch(() => {
    setCurrentFile(fileIndex);
    setReplayData(replayData);
    setFrame(0);
    setClips(clips);
  });
}

export function play() {
  start();
}

export function pause() {
  stop();
}

export function togglePause() {
  running() ? stop() : start();
}

export function tick() {
  setFrame(
    pipe(add(framesPerTick()), frame =>
      wrap(replayData()!.frames.length, frame)
    )
  );
}

export function tickBack() {
  setFrame(pipe(dec, frame => wrap(replayData()!.frames.length, frame)));
}

export function speedNormal() {
  setFps(60);
  setFramesPerTick(1);
}

export function speedFast() {
  setFramesPerTick(2);
}

export function speedSlow() {
  setFps(30);
}

export function zoomIn() {
  setZoom(z => z * 1.01);
}

export function zoomOut() {
  setZoom(z => z / 1.01);
}

export function toggleDebug() {
  setIsDebug(value => !value);
}

export function nextClip() {
  const entries = Array.from(Object.entries(state.clips())).flatMap(
    ([name, clips]) => clips.map((clip): [string, Highlight] => [name, clip])
  );
  const newClipIndex = wrap(entries.length, currentClip() + 1);
  const [_, newClip] = entries[newClipIndex];
  batch(() => {
    setCurrentClip(newClipIndex);
    jump(wrap(replayData()!.frames.length, newClip.startFrame - 30));
  });
}

export function previousClip() {
  const entries = Array.from(Object.entries(state.clips())).flatMap(
    ([name, clips]) => clips.map((clip): [string, Highlight] => [name, clip])
  );
  const newClipIndex = wrap(entries.length, currentClip() - 1);
  const [_, newClip] = entries[newClipIndex];
  batch(() => {
    setCurrentClip(newClipIndex);
    jump(wrap(replayData()!.frames.length, newClip.startFrame - 30));
  });
}

export function setClip(newClipIndex: number) {
  const entries = Array.from(Object.entries(state.clips())).flatMap(
    ([name, clips]) => clips.map((clip): [string, Highlight] => [name, clip])
  );
  const [_, newClip] = entries[newClipIndex];
  batch(() => {
    setCurrentClip(wrap(entries.length, newClipIndex));
    jump(wrap(replayData()!.frames.length, newClip.startFrame - 30));
  });
}

export function jump(target: number) {
  setFrame(wrap(replayData()!.frames.length, target));
}

// percent is [0,1]
export function jumpPercent(percent: number) {
  setFrame(Math.round(replayData()!.frames.length * percent));
}

export function adjust(delta: number) {
  setFrame(pipe(add(delta), frame => wrap(replayData()!.frames.length, frame)));
}

function wrap(max: number, targetFrame: number): number {
  return (targetFrame + max) % max;
}

const killComboQuery: [Query, Predicate?] = [
  [
    { predicate: opponent(isInHitstun) },
    { predicate: opponent(isDead), delayed: true },
  ],
  not(opponent(isInGroundedControl)),
];
const grabPunishQuery: [Query, Predicate?] = [
  [
    { predicate: opponent(isGrabbed) },
    {
      predicate: all(
        not(opponent(isDead)),
        either(not(opponent(isInGroundedControl)), opponent(isOffstage))
      ),
    },
  ],
];
const edgeguardQuery: [Query, Predicate?] = [
  [
    { predicate: opponent(isOffstage) },
    { predicate: not(opponent(isInHitstun)), delayed: true },
    { predicate: opponent(isInHitstun), delayed: true },
  ],
  not(opponent(isInGroundedControl)),
];
const crouchCancelQuery: [Query, Predicate?] = [
  [{ predicate: isCrouching }, { predicate: isInHitstun }],
];
const shieldGrabQuery: [Query, Predicate?] = [
  [
    { predicate: isInShieldstun },
    { predicate: action("Catch"), delayed: true },
  ],
  either(action("Guard"), action("Catch"), action("GuardSetOff")),
];

// load a file from query params if provided. Otherwise start playing the sample
// match.
const url = new URLSearchParams(location.search).get("replayUrl");
const path = location.pathname.slice(1);
if (url) {
  try {
    fetch(url)
      .then(response => response.blob())
      .then(blob => new File([blob], url.split("/").at(-1) ?? "url.slp"))
      .then(file => load([file]));
  } catch (e) {
    console.error("Error: could not load replay", url, e);
  }
} else if (path !== "") {
  downloadReplay(path).then(({ data, error }) => {
    if (data) {
      const file = new File([data], `${path}.slp`);
      load([file]);
    }
    if (error) {
      console.error("Error: could not load replay", error);
    }
  });
}
