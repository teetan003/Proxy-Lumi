FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    3proxy \
    procps \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /etc/3proxy

# Create directory for logs
RUN mkdir -p /var/log/3proxy

# Initial empty config
RUN echo "daemon\nauth strong\nproxy -p3128" > 3proxy.cfg

CMD ["3proxy", "/etc/3proxy/3proxy.cfg"]
