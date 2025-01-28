module ecs_backend {
  source = "./ecs_module"
  cluster_name = "backend-cluster"
  task_name = "backend-task"
  role_arn = "arn:aws:iam::923333015021:role/LabRole"
  container_name = "backend-container"
  image = "${aws_ecr_repository.backend.repository_url}"
  cpu = 1024
  memory = 2048
  port = 8080
  desired_count = 1
  subnet_ids = [ aws_subnet.main.id, aws_subnet.main2.id, aws_subnet.main3.id]
  security_group_id = aws_security_group.backend.id
  vpc_id = aws_vpc.main.id
  environment_variables = {
    "SPRING_DATASOURCE_URL" = "jdbc:postgresql://${aws_db_instance.webchatapp_db.address}:5432/${aws_db_instance.webchatapp_db.db_name}",
    "AWS_SQS_PENDING_MESSAGES_URL" = "${aws_sqs_queue.pending_messages.id}",
    "AWS_SQS_PROCESSED_MESSAGES_URL" = "${aws_sqs_queue.processed_messages.id}"
  }
  health_check_path = "/api/hello"
  health_check_interval = 10
  health_check_timeout = 5
  health_check_healthy_threshold = 3
  health_check_unhealthy_threshold = 3

  depends_on = [ null_resource.backend_docker_image ]
}

module ecs_frontend {
  source = "./ecs_module"
  cluster_name = "frontend-cluster"
  task_name = "frontend-task"
  role_arn = "arn:aws:iam::923333015021:role/LabRole"
  container_name = "frontend-container"
  image = "${aws_ecr_repository.frontend.repository_url}"
  cpu = 256
  memory = 512
  port = 80
  desired_count = 1
  subnet_ids = [ aws_subnet.main.id, aws_subnet.main2.id, aws_subnet.main3.id]
  security_group_id = aws_security_group.frontend.id
  vpc_id = aws_vpc.main.id
  health_check_path = "/"
  health_check_interval = 45
  health_check_timeout = 15
  health_check_healthy_threshold = 3
  health_check_unhealthy_threshold = 3

  depends_on = [ null_resource.frontend_docker_image ]
}