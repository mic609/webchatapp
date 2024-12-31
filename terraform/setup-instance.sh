#!/bin/bash

sudo apt-get update -y
sudo apt-get upgrade -y

# Instalacja Docker
sudo apt-get install -y docker.io

# Uruchomienie Docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Instalacja Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Instalacja Git
sudo apt-get install -y git

# Sklonowanie projektów z GitHub
cd /home/ubuntu
git clone https://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@github.com/mic609/webchatapp.git

echo "Angular config: ${data.template_file.angular_cognito_config.rendered}" > /home/ubuntu/config_check.txt
echo "Springboot config: ${data.template_file.springboot_cognito_config.rendered}" >> /home/ubuntu/config_check.txt

echo "${data.template_file.angular_cognito_config.rendered}" > /home/ubuntu/webchatapp/my-angular-app/src/assets/config.json
echo "${data.template_file.springboot_cognito_config.rendered}" > /home/ubuntu/webchatapp/exampleapp/src/main/resources/cognito_config.json

# # Pobierz publiczny IP z Terraform
# EC2_IP=$(terraform output -raw ec2_instance_public_ip)

# # Zaktualizuj plik konfiguracyjny Angulara
# sed -i "s|<ec2_ip>|$EC2_IP|g" webchatapp/my-angular-app/src/environments/environment.ts

# Uruchomienie Docker Compose dla frontend
cd /home/ubuntu/webchatapp
docker-compose up -d
