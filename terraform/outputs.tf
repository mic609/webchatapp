# output "ec2_instance_public_backend_ip" {
#   value = aws_instance.backend.public_ip
# }

# output "ec2_instance_public_frontend_ip" {
#   value = aws_instance.frontend.public_ip
# }

output "backend_ip" {
  value = module.ecs_backend.ip
  description = "The DNS name of the Load Balancer for the backend service."
}

output "db_connection_url" {
  value = "jdbc:postgresql://${aws_db_instance.webchatapp_db.address}:5432/${aws_db_instance.webchatapp_db.db_name}"
  description = "URL do bazy danych PostgreSQL"
}

output "user_pool_id" {
  value = aws_cognito_user_pool.webchatapp_pool.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.webchatapp_client.id
}
