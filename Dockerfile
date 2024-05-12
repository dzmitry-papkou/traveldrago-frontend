FROM node:21 as builder

COPY . /code
WORKDIR /code
RUN npm ci
RUN npm run build

FROM nginx:1.25.4-alpine

RUN rm /etc/nginx/nginx.conf

COPY .ebextensions/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /code/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]