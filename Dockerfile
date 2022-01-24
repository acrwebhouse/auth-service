FROM node:10
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY . /usr/src/app
RUN npm install 
RUN npm run swagger-autogen
EXPOSE 3000
CMD [ "node","app.js"]