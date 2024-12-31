resource "aws_ecs_cluster" "frontend" {
  name = "frontend-cluster"
}

resource "aws_ecs_task_definition" "frontend_task" {
  family                   = "frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = "arn:aws:iam::923333015021:role/LabRole"
  task_role_arn            = "arn:aws:iam::923333015021:role/LabRole"

  container_definitions = jsonencode([
    {
      name  = "frontend-container"
      image = "${aws_ecr_repository.frontend.repository_url}"
      portMappings = [
        {
          containerPort = 4200
          hostPort      = 4200
        }
      ]
      healthCheck = {
        command = ["CMD", "curl", "-f", "http://localhost"]
        interval = 30
        retries  = 3
        startPeriod = 0
        timeout  = 5
      }
    }
  ])
}

resource "aws_ecs_service" "frontend_service" {
  name            = "frontend-service"
  cluster         = aws_ecs_cluster.frontend.name
  task_definition = aws_ecs_task_definition.frontend_task.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.main.id]
    security_groups = [aws_security_group.frontend.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend_tg.arn
    container_name   = "frontend-container"
    container_port   = 4200
  }

  desired_count = 1
}
