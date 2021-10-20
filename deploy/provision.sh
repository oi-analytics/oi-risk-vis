#!/usr/bin/env bash

#
# Provision virtual machine
# - assuming OS is Ubuntu 18.04 LTS (Bionic)
#

# Install NGINX
sudo apt-get update
sudo apt-get install nginx

# Set up SSL
sudo apt-get install software-properties-common build-essential
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot certonly --nginx

# Install node
NODE_VERSION=v14.15.1
DISTRO=linux-x64
# download
wget -nc https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-$DISTRO.tar.xz
# extract
sudo mkdir /usr/local/lib/node
sudo tar xf node-$NODE_VERSION-$DISTRO.tar.xz -C /usr/local/lib/node
rm node-$NODE_VERSION-$DISTRO.tar.xz
# setup
sudo mv /usr/local/lib/node/node-$NODE_VERSION-$DISTRO /usr/local/lib/node/node-$NODE_VERSION
sudo ln -s /usr/local/lib/node/node-$NODE_VERSION/bin/node /usr/bin/node
sudo ln -s /usr/local/lib/node/node-$NODE_VERSION/bin/npm /usr/bin/npm
sudo ln -s /usr/local/lib/node/node-$NODE_VERSION/bin/npx /usr/bin/npx

sudo chown :ubuntu /usr/local/lib/node/node-v14.15.1/lib/node_modules/
sudo chmod 775 /usr/local/lib/node/node-v14.15.1/lib/node_modules/
sudo chown :ubuntu /usr/local/lib/node/node-v14.15.1/bin/
sudo chmod 775 /usr/local/lib/node/node-v14.15.1/bin/

npm config set python /usr/bin/python3

# Install tileserver
npm i -g tileserver-gl-light
