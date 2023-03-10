FROM node:18-alpine as node
WORKDIR /
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "preview"]
