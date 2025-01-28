resource "aws_lb" "main" {
  name               = "${var.cluster_name}-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.security_group_id]
  subnets            = var.subnet_ids

  enable_deletion_protection = false
}

resource "aws_lb_target_group" "main" {
  name     = "${var.cluster_name}-lb-tg"
  port     = var.port
  target_type = "ip"
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  health_check {
    path                = var.health_check_path
    protocol            = "HTTP"
    port                = var.port
    interval            = var.health_check_interval    # Czas między próbami health check (w sekundach)
    timeout             = var.health_check_timeout     # Czas oczekiwania na odpowiedź (w sekundach)
    healthy_threshold   = var.health_check_healthy_threshold     # Liczba zdrowych odpowiedzi z rzędu, aby uznać kontener za zdrowy
    unhealthy_threshold = var.health_check_unhealthy_threshold     # Liczba niezdrowych odpowiedzi z rzędu, aby uznać kontener za niedostępny
  }
}

resource "aws_lb_listener" "main" {
  load_balancer_arn = aws_lb.main.arn
  port              = var.port
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }


}