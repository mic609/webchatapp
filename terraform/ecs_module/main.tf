resource "aws_ecs_cluster" "main" {
  name = var.cluster_name
}

resource "aws_ecs_task_definition" "main" {
  family       = var.task_name
  requires_compatibilities = ["FARGATE"]
  network_mode = "awsvpc"
  cpu          = var.cpu
  memory       = var.memory
  execution_role_arn       = var.role_arn
  task_role_arn            = var.role_arn

  container_definitions = jsonencode([
    {
      name      = var.container_name
      image     = var.image
      cpu       = var.cpu
      memory    = var.memory
      essential = true
      portMappings = [
        {
          containerPort = var.port
          hostPort      = var.port
        }
      ]
      environment = [
        for key, value in var.environment_variables :
        {
          name  = key
          value = value
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "main" {
  name            = var.task_name
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets = var.subnet_ids
    security_groups = [var.security_group_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = var.container_name
    container_port   = var.port
  }
}