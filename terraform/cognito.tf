resource "aws_cognito_user_pool" "webchatapp_pool" {
  name = "webchatapp-pool-terraform"

  password_policy {
    minimum_length    = 8
    require_numbers   = true
    require_lowercase = true
    require_uppercase = true
    require_symbols = true
    temporary_password_validity_days = 7
  }

  mfa_configuration = "OFF"

  account_recovery_setting {
    recovery_mechanism {
      name     = "admin_only"
      priority = 1
    }
  }

  auto_verified_attributes = []

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }
  
  user_pool_add_ons {
    advanced_security_mode = "ENFORCED"
  }
}

// Klient
resource "aws_cognito_user_pool_client" "webchatapp_client" {
  name                       = "webchatapp-client-terraform"
  user_pool_id               = aws_cognito_user_pool.webchatapp_pool.id
  generate_secret            = false
  allowed_oauth_flows_user_pool_client = false
  refresh_token_validity     = 30
  access_token_validity      = 60
  id_token_validity          = 60
  prevent_user_existence_errors = "ENABLED"
  enable_token_revocation = true

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
}
