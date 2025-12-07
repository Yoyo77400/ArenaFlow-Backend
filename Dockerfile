FROM node:20-alpine AS tsc-builder
WORKDIR /workspace
COPY package.json /workspace/
RUN npm install
COPY . /workspace/
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /workspace
COPY package.json /workspace/
RUN npm install --production
COPY --from=tsc-builder /workspace/dist /workspace/dist

EXPOSE $PORT
CMD ["npm", "start"]
