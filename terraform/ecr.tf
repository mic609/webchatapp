resource "aws_ecr_repository" "backend" {
  name = "backend-app"
  force_delete = true

  depends_on = [ local_file.springboot_cognito_config ]
}

resource "aws_ecr_repository" "frontend" {
  name = "frontend-app"
  force_delete = true

  depends_on = [ local_file.angular_cognito_config, local_file.angular_environment_config ]
}
