FROM node:18.16-bullseye AS development
LABEL authors="michal"
WORKDIR /app

COPY my_flashcards_frontend .
#COPY ./compose/local/trainer_frontend/start_trainer_frontend ./start_trainer_frontend

#RUN sed -i 's/\r$//g' ./start_trainer_frontend
#RUN chmod +x ./start_trainer_frontend

RUN npm install
#CMD ["npm", "run", "build"]
CMD ["npm", "run", "dev"]
