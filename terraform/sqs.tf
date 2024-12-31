resource "aws_sqs_queue" "messages" {
  name                        = "webchatapp-messages-queue.fifo"
  visibility_timeout_seconds  = 10
  delay_seconds               = 0
  fifo_queue                  = true
  content_based_deduplication = true
}
