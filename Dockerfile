FROM node:16

#Environment
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

#app
ARG PORT
ENV PORT ${PORT}

ARG ENDPOINT_API
ENV ENDPOINT_API ${ENDPOINT_API}

#DB config
ARG DB_PORT
ENV DB_PORT ${DB_PORT}

ARG DB_INSTANCE
ENV DB_INSTANCE ${DB_INSTANCE}

# connection pool config
ARG DB_POOL_MIN
ENV DB_POOL_MIN ${DB_POOL_MIN}

ARG DB_POOL_MAX
ENV DB_POOL_MAX ${DB_POOL_MAX}

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ["package.json", "package-lock.json", "./"]

RUN npm install --verbose
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "node", "bin/www" ]