resource "aws_lambda_function" "message_processor" {
  function_name = "message-processor"
  role          = "arn:aws:iam::923333015021:role/LabRole"
  handler       = "message-processor.lambda_handler"
  runtime       = "python3.8"
  timeout       = 10

  filename = "lambda_code/message-processor.zip"

  reserved_concurrent_executions = 2 // maksymalnie dwie instancje
  
  environment {
    variables = {
      PENDING_QUEUE_URL    = aws_sqs_queue.pending_messages.url
      PROCESSED_QUEUE_URL  = aws_sqs_queue.processed_messages.url
    }
  }
}