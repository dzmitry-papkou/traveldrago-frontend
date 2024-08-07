FROM node:21-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.25.4-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/cache-headers.conf /etc/nginx/conf.d/cache-headers.conf
COPY nginx/nocache-headers.conf /etc/nginx/conf.d/nocache-headers.conf
COPY nginx/security-headers.conf /etc/nginx/conf.d/security-headers.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
