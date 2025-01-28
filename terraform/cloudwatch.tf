resource "aws_cloudwatch_metric_alarm" "sqs_pending_messages_alarm" {
  alarm_name          = "SQS-Pending-Messages-Alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateNumberOfMessagesNotVisible" // messages in flight
  namespace           = "AWS/SQS"
  period              = 10
  statistic           = "Average"
  threshold           = 3
  alarm_description   = "Alarm when the number of messages in flight exceeds 3."
  actions_enabled     = false

  dimensions = {
    QueueName = aws_sqs_queue.pending_messages.name
  }
}
