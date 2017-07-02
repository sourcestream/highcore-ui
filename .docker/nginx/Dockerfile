FROM nginx:latest

ENV DOCKERIZE_VERSION v0.5.0
ADD https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz /tmp/dockerize.tar.gz
RUN tar -C /usr/local/bin -xzvf /tmp/dockerize.tar.gz \
    && rm /tmp/dockerize.tar.gz

COPY default.conf /etc/nginx/default.tmpl

CMD dockerize -template /etc/nginx/default.tmpl:/etc/nginx/conf.d/default.conf -wait tcp://ui:8080 -timeout 20s nginx -g "daemon off;"