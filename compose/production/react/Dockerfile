FROM node:18-alpine

WORKDIR /app

COPY ./my_flashcards_frontend/package.json .

RUN npm install

COPY ./my_flashcards_frontend/ .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "preview" ]
