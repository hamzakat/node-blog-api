FROM node:15
WORKDIR /app

# '.' dot means WORKDIR
COPY package.json . 
RUN npm install

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
    fi


# 'COPY . ./' : copy everything to the WORKDIR
# we copy 'package.json' and run 'npm instal' beforehand in order to leverage the caching feature of docker (for optimization)
# so, when we rebuild the image, if 'package.json' isn't changed, the build system will use the previously made cache, and won't run the commands
COPY . ./

# default port is 3000
ENV PORT 3000

EXPOSE $PORT

CMD [ "node", "index.js"]  