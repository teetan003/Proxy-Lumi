FROM alpine:edge

RUN apk add --no-cache procps 3proxy

WORKDIR /etc/3proxy

# Ensure log directory exists and handle potential conflicts
RUN rm -rf /var/log/3proxy && mkdir -p /var/log/3proxy

# Initial empty config
RUN printf "daemon\nauth strong\nproxy -p3128\n" > 3proxy.cfg

CMD ["3proxy", "/etc/3proxy/3proxy.cfg"]

