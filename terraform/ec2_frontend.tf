# resource "aws_instance" "frontend" {
#   ami           = "ami-0866a3c8686eaeeba"
#   instance_type = "t3.medium"
#   key_name = "webchatapp-key"
#   subnet_id     = aws_subnet.main.id
#   vpc_security_group_ids = [aws_security_group.frontend.id]
#   associate_public_ip_address = true
#   depends_on = [ aws_instance.backend ]

#   tags = {
#     Name = "webchatapp-instance-frontend-terraform"
#   }

#   user_data = <<-EOF
# #!/bin/bash

# sudo apt-get update -y
# sudo apt-get upgrade -y

# # Instalacja Docker
# sudo apt-get install -y docker.io

# # Uruchomienie Docker
# sudo systemctl start docker
# sudo systemctl enable docker
# sudo usermod -aG docker ubuntu

# # Instalacja Docker Compose
# sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
# chmod +x /usr/local/bin/docker-compose

# # Instalacja Git
# sudo apt-get install -y git

# # Sklonowanie projektów z GitHub
# cd /home/ubuntu
# git clone https://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@github.com/mic609/webchatapp.git

# echo "${data.template_file.angular_cognito_config.rendered}" > /home/ubuntu/webchatapp/my-angular-app/src/assets/config.json
# echo "${data.template_file.angular_environment_config.rendered}" > /home/ubuntu/webchatapp/my-angular-app/src/environments/environment.ts

# # Uruchomienie Docker Compose
# cd /home/ubuntu/webchatapp/my-angular-app
# docker-compose up -d

# EOF
# }
