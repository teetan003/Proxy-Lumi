FROM alpine:latest

RUN apk add --no-cache procps \
    && apk add --no-cache 3proxy --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing/

WORKDIR /etc/3proxy

# Create directory for logs
RUN mkdir -p /var/log/3proxy

# Initial empty config
RUN printf "daemon\nauth strong\nproxy -p3128\n" > 3proxy.cfg

CMD ["3proxy", "/etc/3proxy/3proxy.cfg"]
