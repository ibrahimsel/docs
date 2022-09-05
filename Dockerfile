FROM  nginx:1.18.0

COPY ./build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./htpasswd /etc/nginx/.htpasswd

EXPOSE 80
