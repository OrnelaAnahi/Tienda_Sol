FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY packages/backend/package*.json ./packages/backend/

RUN npm install --workspace=backend --ignore-scripts --omit=dev

COPY packages/backend ./packages/backend

EXPOSE 3001

WORKDIR /app/packages/backend

CMD ["node", "index.js"]