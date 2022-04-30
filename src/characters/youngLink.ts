import { Character } from "./character";

import { ActionName } from "../ids";
export const youngLink: Character = {
  scale: 0.96,
  shieldOffset: [2.724, 9.003], // model units // TODO
  shieldSize: 0.96 * 11.625, // world units
  animationMap: new Map<ActionName, string>([
    ["AppealL", "AppealL"],
    ["AppealR", "AppealR"],
    ["AttackS3Hi", "AttackS3Hi"],
    ["AttackS3HiS", "AttackS3Hi"],
    ["AttackS3Lw", "AttackS3Lw"],
    ["AttackS3LwS", "AttackS3Lw"],
    ["AttackS3S", "AttackS3"],
    ["AttackS4Hi", "AttackS4Hi"],
    ["AttackS4HiS", "AttackS4Hi"],
    ["AttackS4Lw", "AttackS4Lw"],
    ["AttackS4LwS", "AttackS4Lw"],
    ["AttackS4S", "AttackS41"],
    ["BarrelWait", ""],
    ["Bury", ""],
    ["BuryJump", ""],
    ["BuryWait", ""],
    ["CaptureCaptain", ""],
    ["CaptureDamageKoopa", ""],
    ["CaptureDamageKoopaAir", ""],
    ["CaptureKirby", ""],
    ["CaptureKirbyYoshi", ""],
    ["CaptureKoopa", ""],
    ["CaptureKoopaAir", ""],
    ["CaptureMewtwo", ""],
    ["CaptureMewtwoAir", ""],
    ["CaptureWaitKirby", ""],
    ["CaptureWaitKoopa", ""],
    ["CaptureWaitKoopaAir", ""],
    ["CaptureYoshi", ""],
    ["CatchDashPull", "CatchWait"],
    ["CatchPull", "CatchWait"],
    ["DamageBind", ""],
    ["DamageIce", ""],
    ["DamageIceJump", "Fall"],
    ["DamageSong", ""],
    ["DamageSongRv", ""],
    ["DamageSongWait", ""],
    ["DeadDown", ""],
    ["DeadLeft", ""],
    ["DeadRight", ""],
    ["DeadUpFallHitCamera", ""],
    ["DeadUpFallHitCameraIce", ""],
    ["DeadUpFallIce", ""],
    ["DeadUpStar", ""],
    ["DeadUpStarIce", ""],
    ["DownReflect", ""],
    ["EntryEnd", "Entry"],
    ["EntryStart", "Entry"],
    ["Escape", "EscapeN"],
    ["FlyReflectCeil", ""],
    ["FlyReflectWall", "WallDamage"],
    ["Guard", "Guard"],
    ["GuardOff", "GuardOff"],
    ["GuardOn", "GuardOn"],
    ["GuardReflect", "Guard"],
    ["GuardSetOff", "GuardDamage"],
    ["ItemParasolDamageFall", ""],
    ["ItemParasolFall", ""],
    ["ItemParasolFallSpecial", ""],
    ["ItemParasolOpen", ""],
    ["KirbyYoshiEgg", ""],
    ["KneeBend", "Landing"],
    ["LandingFallSpecial", "Landing"],
    ["LiftTurn", ""],
    ["LiftWait", ""],
    ["LiftWalk1", ""],
    ["LiftWalk2", ""],
    ["LightThrowAirB4", "LightThrowAirB"],
    ["LightThrowAirF4", "LightThrowAirF"],
    ["LightThrowAirHi4", "LightThrowAirHi"],
    ["LightThrowAirLw4", "LightThrowAirLw"],
    ["LightThrowB4", "LightThrowB"],
    ["LightThrowF4", "LightThrowF"],
    ["LightThrowHi4", "LightThrowHi"],
    ["LightThrowLw4", "LightThrowLw"],
    ["Rebirth", "Entry"],
    ["RebirthWait", "Wait"],
    ["ReboundStop", ""],
    ["RunDirect", ""],
    ["ShieldBreakDownD", "DownBoundD"],
    ["ShieldBreakDownU", "DownBoundU"],
    ["ShieldBreakFall", "DamageFall"],
    ["ShieldBreakFly", ""],
    ["ShieldBreakStandD", "DownStandD"],
    ["ShieldBreakStandU", "DownStandU"],
    ["ShoulderedTurn", ""],
    ["ShoulderedWait", ""],
    ["ShoulderedWalkFast", ""],
    ["ShoulderedWalkMiddle", ""],
    ["ShoulderedWalkSlow", ""],
    ["SwordSwing1", "Swing1"],
    ["SwordSwing3", "Swing3"],
    ["SwordSwing4", "Swing4"],
    ["SwordSwingDash", "SwingDash"],
    ["ThrownB", ""],
    ["ThrownCopyStar", ""],
    ["ThrownF", ""],
    ["ThrownFB", ""],
    ["ThrownFF", ""],
    ["ThrownFHi", ""],
    ["ThrownFLw", ""],
    ["ThrownHi", ""],
    ["ThrownKirby", ""],
    ["ThrownKirbyStar", ""],
    ["ThrownKoopaAirB", ""],
    ["ThrownKoopaAirF", ""],
    ["ThrownKoopaB", ""],
    ["ThrownKoopaF", ""],
    ["ThrownLw", ""],
    ["ThrownLwWomen", ""],
    ["ThrownMewtwo", ""],
    ["ThrownMewtwoAir", ""],
    ["Wait", "Wait"],
    ["YoshiEgg", ""],
  ]),
  specialsMap: new Map<number, string>([
    [341, "AttackS42"],
    [342, "AppealR"],
    [343, "AppealL"],
    [344, "SpecialNStart"],
    [345, "SpecialNLoop"],
    [346, "SpecialNEnd"],
    [347, "SpecialAirNStart"],
    [348, "SpecialAirNLoop"],
    [349, "SpecialAirNEnd"],
    [350, "SpecialS1"],
    [351, "SpecialS2"],
    [352, "SpecialS1"],
    [353, "SpecialAirS1"],
    [354, "SpecialAirS2"],
    [355, "SpecialAirS1"],
    [356, "SpecialHi"],
    [357, "SpecialAirHi"],
    [358, "SpecialLw"],
    [359, "SpecialAirLw"],
    [360, "AirCatch"],
    [361, "AirCatchHit"],
  ]),
};
