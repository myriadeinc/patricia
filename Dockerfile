FROM node:14.20.0-buster
  WORKDIR /usr/src/app
  RUN chown node:node -R /usr/src/app
  

  RUN apt-get -qq update && \
  apt-get -qq install -y libc6-dev \
  libboost-all-dev \
  libsodium-dev \
  libsodium23


  USER node

  COPY --chown=node:node package*.json ./
#   Install early to catch any potential errors in the build process
  RUN npm install https://github.com/MoneroOcean/node-cryptoforknote-util.git
  RUN npm install https://github.com/MoneroOcean/node-cryptonight-hashing.git

  RUN npm install 

  COPY --chown=node:node ./src ./src
  
  CMD ["node", "src/main.js"]