#!/bin/bash

apt update -y
apt install -y curl

curl -sfL https://get.k3s.io | sh -

sleep 20

mkdir -p /home/ubuntu/.kube
cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/.kube/config
chown -R ubuntu:ubuntu /home/ubuntu/.kube