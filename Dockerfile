FROM node:15
WORKDIR /app

# '.' dot means WORKDIR
COPY package.json . 
RUN npm install

# 'COPY . ./' : copy everything to the WORKDIR
# we copy 'package.json' and run 'npm instal' beforehand in order to leverage the caching feature of docker (for optimization)
# so, when we rebuild the image, if 'package.json' isn't changed, the build system will use the previously made cache, and won't run the commands
COPY . ./

EXPOSE 3000
CMD [ "node", "index.js"]