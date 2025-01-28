variable "cluster_name" {
  description = "Name of the ECS cluster"
}

variable "task_name" {
  description = "Name of the ECS task"
}

variable "container_name" {
  description = "Name of the container"
}

variable "image" {
  description = "Docker image for the container"
}

variable "cpu" {
  description = "CPU units for the task"
  default     = 1024
}

variable "memory" {
  description = "Memory in MiB for the task"
  default     = 2048
}

variable "port" {
  description = "Port number for the application"
}

variable "desired_count" {
  description = "Desired number of tasks"
  default     = 1
}

variable "subnet_ids" {
  description = "List of subnet IDs for ECS tasks"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID for ECS tasks and ELB"
}

variable "vpc_id" {
  description = "VPC ID for the target group"
}

variable "environment_variables" {
  description = "Map of environment variables to pass to the container"
  type        = map(string)
  default     = {}
}

variable "health_check_path"{
    type = string
    default = "/"
}

variable "health_check_interval"{
    type = number
}

variable "health_check_timeout"{
    type = number
}

variable "health_check_healthy_threshold"{
    type = number
}

variable "health_check_unhealthy_threshold"{
    type = number
}

variable "role_arn" {
    type = string
}