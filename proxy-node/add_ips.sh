#!/bin/bash

# This script adds multiple IPv4 addresses to a network interface.
# Usage: ./add_ips.sh ips.txt eth0

IPS_FILE=${1:-"ips.txt"}
INTERFACE=${2:-"eth0"}

if [ ! -f "$IPS_FILE" ]; then
    echo "Error: IP list file $IPS_FILE not found."
    exit 1
fi

echo "Adding IPs from $IPS_FILE to $INTERFACE..."

while read ip; do
  if [[ ! -z "$ip" ]]; then
    echo "Adding $ip..."
    ip addr add $ip/24 dev $INTERFACE
  fi
done < "$IPS_FILE"

echo "Done."
