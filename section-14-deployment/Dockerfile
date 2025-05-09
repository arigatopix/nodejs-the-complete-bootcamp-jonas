FROM node:18.20.8

WORKDIR /usr/src/app

# Install required dependencies for sharp
RUN apt-get update && apt-get install -y \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start"]