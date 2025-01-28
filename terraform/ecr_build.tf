resource "null_resource" "frontend_docker_image" {
  provisioner "local-exec" {
    command = "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.us-east-1.amazonaws.com && docker build -t frontend-app ../my-angular-app && docker tag frontend-app:latest ${aws_ecr_repository.frontend.repository_url}:latest && docker push ${aws_ecr_repository.frontend.repository_url}:latest"
  }

  depends_on = [aws_ecr_repository.frontend]
}

resource "null_resource" "backend_docker_image" {
  provisioner "local-exec" {
    command = "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.us-east-1.amazonaws.com && docker build -t backend-app ../exampleapp && docker tag backend-app:latest ${aws_ecr_repository.backend.repository_url}:latest && docker push ${aws_ecr_repository.backend.repository_url}:latest"
  }

  depends_on = [aws_ecr_repository.backend]
}
