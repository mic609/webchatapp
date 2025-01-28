output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = aws_ecs_service.main.name
}

output "ip" {
  description = "DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}

output "lb_name" {
  description = "DNS name of the load balancer"
  value       = aws_lb.main.name
}
