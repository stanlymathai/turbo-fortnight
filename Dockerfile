# Use multi-stage build to separate build and production stages

# Build stage
FROM node:16 AS build
WORKDIR /usr/src/app

# Copy only the package.json and package-lock.json first to leverage Docker cache
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --verbose

# Production stage
FROM node:16
WORKDIR /usr/src/app

#Environment
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

#app
ARG PORT
ENV PORT ${PORT}

#app_key
ARG APP_KEY
ENV APP_KEY ${APP_KEY}

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

# aws
ARG AWS_REGION
ENV AWS_REGION ${AWS_REGION}

ARG AWS_ACCESS_KEY_ID
ENV AWS_ACCESS_KEY_ID ${AWS_ACCESS_KEY_ID}

ARG AWS_SECRET_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY ${AWS_SECRET_ACCESS_KEY}

ARG AWS_BUCKET_NAME
ENV AWS_BUCKET_NAME ${AWS_BUCKET_NAME}


# Copy node_modules from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .

# Change ownership and permissions for the uploads directory and its content
RUN chown -R node:node ./uploads && chmod -R 755 ./uploads

# Run as non-root user for security
USER node

# Expose the port the app runs on
EXPOSE 8080

# Add a health check command
HEALTHCHECK --interval=12s --timeout=12s --start-period=30s CMD node ./src/utils/healthCheck.util.js

CMD ["./bin/www"]