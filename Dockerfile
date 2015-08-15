FROM node:0.10.40

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD build /usr/src/app/

RUN [ "npm", "install" ]
CMD [ "node", "./bin/www" ]