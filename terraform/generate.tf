data "template_file" "angular_cognito_config" {
  template = file("${path.module}/tpl_files/angular_cognito_config.json.tpl")
  vars = {
    cognito_user_pool_id   = aws_cognito_user_pool.webchatapp_pool.id
    cognito_app_client_id  = aws_cognito_user_pool_client.webchatapp_client.id
  }
}

resource "local_file" "angular_cognito_config" {
  content  = data.template_file.angular_cognito_config.rendered
  filename = "${path.module}/../my-angular-app/generated_files/angular_cognito_config.json"
}

data "template_file" "springboot_cognito_config" {
  template = file("${path.module}/tpl_files/springboot_cognito_config.json.tpl")
  vars = {
    cognito_user_pool_id   = aws_cognito_user_pool.webchatapp_pool.id
    cognito_app_client_id  = aws_cognito_user_pool_client.webchatapp_client.id
  }
}

resource "local_file" "springboot_cognito_config" {
  content  = data.template_file.springboot_cognito_config.rendered
  filename = "${path.module}/../exampleapp/generated_files/springboot_cognito_config.json"
}

data "template_file" "angular_environment_config" {
  template = file("${path.module}/tpl_files/angular_environment_config.ts.tpl")
  vars = {
    backend_ip = module.ecs_backend.ip
  }
}

resource "local_file" "angular_environment_config" {
  content  = data.template_file.angular_environment_config.rendered
  filename = "${path.module}/../my-angular-app/generated_files/angular_environment_config.ts"
}