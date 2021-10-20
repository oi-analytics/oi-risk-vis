# Deploy

To build and deploy the site:

- provision a server
- configure the server
- build the frontend
- upload frontend, data and config

Server provision (and related DNS/access configuration) for AWS can be run
using terraform.

Install the
[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
then run:

  aws configure   # one-off to set your AWS credentials

Install [terraform](https://www.terraform.io/) then run:

  terraform init  # one-off to fetch provider from terraform registry
  terraform plan  # to see what actions will be taken in detail
  terraform apply # rerun after any change to main.tf

npx browserslist@latest --update-db


`provision.sh` contains installation instructions for an Ubuntu 18.04 server to
install NGINX, setup SSL using CertBot, install node and tileserver-gl-light.

> TODO: get terraform to run `provision.sh` and the config setup below.
> Currently, follow the remaining manual steps.

`config/` directory contains:

- nginx config to serve frontend assets directly and proxy tile requests to the
  tileserver

    sudo cp \
        ./config/etc/nginx/sites-available/seasia.infrastructureresilience.org \
        /etc/nginx/sites-available/seasia.infrastructureresilience.org
    sudo rm /etc/nginx/sites-enabled/default
    sudo ln -s \
        /etc/nginx/sites-available/seasia.infrastructureresilience.org \
        /etc/nginx/sites-enabled/seasia.infrastructureresilience.org
    sudo service nginx reload


- systemd service config to run the tileserver as a service

    sudo cp \
        ./config/etc/systemd/system/tileserver.service \
        /etc/systemd/system/tileserver.service
    sudo service tileserver start
    sudo service tileserver status    # check status
    journalctl -u tileserver.service  # see logs
    sudo systemctl enable tileserver  # enable on boot

`deploy.sh` runs npm build, uploads the build directory, data and tileserver
config to the server, and restarts the tileserver. Run this from a local
machine.
