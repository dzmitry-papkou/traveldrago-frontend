FROM node:21 as builder

COPY . /code
WORKDIR /code
RUN npm ci
RUN npm run build

FROM node:21-alpine

RUN npm install -g http-server

COPY --from=builder /code/build /usr/share/nginx/html
EXPOSE 80

CMD ["http-server", "/usr/share/nginx/html", "-p", "80"]