# Use a Node.js base image
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the default Vite dev server port
EXPOSE 5173

# The command to start the development server
# This is not suitable for production and will not work correctly
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
