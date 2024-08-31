FROM node:22.1.0
WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g typescript
RUN npx tsc 
EXPOSE 8000
CMD ["node", "dist/app.js"]