FROM node:12
					
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

VOLUME /app/logs

EXPOSE 8080

CMD ["npm", "start"]