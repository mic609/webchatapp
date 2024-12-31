# resource "aws_instance" "backend" {
#   ami           = "ami-0866a3c8686eaeeba"
#   instance_type = "t3.medium"
#   key_name = "webchatapp-key"
#   subnet_id     = aws_subnet.main.id
#   vpc_security_group_ids = [aws_security_group.backend.id]
#   associate_public_ip_address = true

#   tags = {
#     Name = "webchatapp-instance-backend-terraform"
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

# echo "${data.template_file.springboot_cognito_config.rendered}" > /home/ubuntu/webchatapp/exampleapp/src/main/resources/cognito_config.json
# echo -e "\nspring.datasource.url=jdbc:postgresql://${aws_db_instance.webchatapp_db.address}:5432/${aws_db_instance.webchatapp_db.db_name}" >> ./webchatapp/exampleapp/src/main/resources/application.properties

# # Uruchomienie Docker Compose
# cd /home/ubuntu/webchatapp/exampleapp
# docker-compose up -d

# EOF
# }