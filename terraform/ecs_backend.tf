resource "aws_ecs_cluster" "backend" {
  name = "backend-cluster"
}

resource "aws_ecs_task_definition" "backend_task" {
  family                   = "backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"
  execution_role_arn       = "arn:aws:iam::923333015021:role/LabRole"
  task_role_arn            = "arn:aws:iam::923333015021:role/LabRole"

  container_definitions = jsonencode([
    {
      name  = "backend-container"
      image = "${aws_ecr_repository.backend.repository_url}"
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]
      environment = [
        {
          name  = "SPRING_DATASOURCE_URL"
          value = "jdbc:postgresql://${aws_db_instance.webchatapp_db.address}:5432/${aws_db_instance.webchatapp_db.db_name}"
        },
        {
          name  = "AWS_SQS_URL"
          value = "${aws_sqs_queue.messages.id}"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_log_group.name
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "backend"
        }
      }
    }
  ])

  depends_on = [ aws_db_instance.webchatapp_db ]
}

resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.backend.name
  task_definition = aws_ecs_task_definition.backend_task.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.main.id]
    security_groups = [aws_security_group.backend.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend_tg.arn
    container_name   = "backend-container"
    container_port   = 8080
  }

  desired_count = 1
}

resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name = "/ecs/backend-task"
  retention_in_days = 7
}
