FROM node:14.17.0-buster
  WORKDIR /usr/src/app
  RUN chown node:node -R /usr/src/app
  

  RUN apt-get -qq update && \
  apt-get install libc6-dev=2.28-10 && \
  apt-get -qq install -y \
  libboost-all-dev=1.67.0.1 \
  libsodium-dev=1.0.17-1 \
  libsodium23=1.0.17-1 


  USER node

  COPY --chown=node:node package*.json ./
#   Install early to catch any potential errors in the build process
  RUN npm install https://github.com/MoneroOcean/node-cryptoforknote-util.git#af5a7c21862a4ce324d55e9c461e2a8d8b8b3b42
  RUN npm install https://github.com/MoneroOcean/node-cryptonight-hashing.git#743a6d62f44e6e3de645033f7b54d9f37c38cc81

  RUN npm install 

  COPY --chown=node:node . .
  
  CMD ["node", "src/main.js"]