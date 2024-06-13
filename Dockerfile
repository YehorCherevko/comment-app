# Use the official Node.js image.
FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code.
COPY . .

# Build the app.
RUN npm run build

# Expose the port the app runs on.
EXPOSE 3000

# Define environment variable.
ENV NODE_ENV production

# Start the app.
CMD ["node", "dist/main"]
