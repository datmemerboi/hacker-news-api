FROM node:12
CMD node --version
CMD nmp --version
RUN mkdir -p /usr/src/hacker-news-api
WORKDIR /usr/src/hacker-news-api
COPY . ./
RUN npm install
EXPOSE 8080
CMD ["npm", "start"]
