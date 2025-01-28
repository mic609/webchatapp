module "terraform-aws-ecs-service-autoscaling-backend" {
  source                      = "./terraform-aws-ecs-service-autoscaling"
  ecs_cluster_name            = module.ecs_backend.ecs_cluster_name
  ecs_service_name            = module.ecs_backend.ecs_service_name
  cooldown                    = 60
  name_prefix                 = "backend-autoscaling"
  max_cpu_threshold           = 85
  min_cpu_threshold           = 10
  max_cpu_evaluation_period   = 3
  min_cpu_evaluation_period   = 3
  max_cpu_period              = 60
  min_cpu_period              = 60
  scale_target_min_capacity   = 1
  scale_target_max_capacity   = 2
  tags                        = {
    "App" = "backend"
    }
}

module "terraform-aws-ecs-service-autoscaling-frontend" {
  source                      = "./terraform-aws-ecs-service-autoscaling"
  ecs_cluster_name            = module.ecs_frontend.ecs_cluster_name
  ecs_service_name            = module.ecs_frontend.ecs_service_name
  cooldown                    = 60
  name_prefix                 = "frontend-autoscaling"
  max_cpu_threshold           = 85
  min_cpu_threshold           = 10
  max_cpu_evaluation_period   = 3
  min_cpu_evaluation_period   = 3
  max_cpu_period              = 60
  min_cpu_period              = 60
  scale_target_min_capacity   = 1
  scale_target_max_capacity   = 2
  tags                        = {
    "App" = "frontend"
    }
}
