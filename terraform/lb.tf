# Load balancer (application)
resource "aws_lb" "main" {
  name               = "lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.frontend.id, aws_security_group.backend.id]
  subnets            = [aws_subnet.main.id, aws_subnet.main2.id]
}

resource "aws_lb_target_group" "backend_tg" {
  name     = "backend-target-group"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  target_type = "ip"

  health_check {
    interval            = 10    # Czas między próbami health check (w sekundach)
    path                = "/api/hello"  # Ścieżka do endpointu health check (np. /health)
    protocol            = "HTTP"
    port                = "traffic-port"  # Port kontenera, na którym działa aplikacja
    timeout             = 5     # Czas oczekiwania na odpowiedź (w sekundach)
    healthy_threshold   = 3     # Liczba zdrowych odpowiedzi z rzędu, aby uznać kontener za zdrowy
    unhealthy_threshold = 3     # Liczba niezdrowych odpowiedzi z rzędu, aby uznać kontener za niedostępny
  }
}

resource "aws_lb_listener" "backend_listener" {
  load_balancer_arn = aws_lb.main.arn
  port              = 8080
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend_tg.arn
  }
}

resource "aws_lb_target_group" "frontend_tg" {
  name     = "frontend-target-group"
  port     = 4200
  protocol = "HTTP"  # Zmieniono z TCP na HTTP
  vpc_id   = aws_vpc.main.id
  target_type = "ip"
}

resource "aws_lb_listener" "frontend_listener" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_tg.arn
  }
}

# resource "aws_lb_listener_rule" "frontend_rule" {
#   listener_arn = aws_lb_listener.frontend_listener.arn
#   priority     = 10

#   action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.frontend_tg.arn
#   }

#   condition {
#     path_pattern {
#       values = ["/frontend*"]
#     }
#   }
# }
