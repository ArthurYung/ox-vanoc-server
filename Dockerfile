FROM node:alpine
RUN rm -rf /app
RUN mkdir /app
WORKDIR /app
COPY . /app
EXPOSE 3008
CMD [ "npm", "start" ]
