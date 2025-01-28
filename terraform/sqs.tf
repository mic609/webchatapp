resource "aws_sqs_queue" "pending_messages" {
  name                        = "webchatapp-pending-messages-queue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
}

# Powiązanie lamdy z kolejką pending_messages
resource "aws_lambda_event_source_mapping" "sqs_trigger_pending_messages" {
  event_source_arn  = aws_sqs_queue.pending_messages.arn
  function_name     = aws_lambda_function.message_processor.function_name
  batch_size        = 1 # Jedna wiadomość na raz przetwarzana przez lambdę
  enabled           = true
}

resource "aws_sqs_queue" "processed_messages" {
  name                        = "webchatapp-processed-messages-queue.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
}
