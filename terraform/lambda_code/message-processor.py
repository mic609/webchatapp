import os
import time
import json
import logging
import boto3

sqs_client = boto3.client('sqs')

PENDING_MESSAGES_QUEUE_URL = os.environ['PENDING_QUEUE_URL']
PROCESSED_MESSAGES_QUEUE_URL = os.environ['PROCESSED_QUEUE_URL']

logging.basicConfig(level=logging.INFO)

def get_pending_message_count():
    try:
        response = sqs_client.get_queue_attributes(
            QueueUrl=PENDING_MESSAGES_QUEUE_URL,
            AttributeNames=['ApproximateNumberOfMessages']
        )
        return int(response['Attributes']['ApproximateNumberOfMessages'])
    except Exception as e:
        logging.error(f"Failed to get message count from SQS queue: {str(e)}")
        return 0

def lambda_handler(event, context):
    print(f"Received event: {json.dumps(event)}")
    
    message_body = event['Records'][0]['body']
    
    try:
        message_data = json.loads(message_body)
        content = message_data.get('content', '')
    except Exception as e:
        logging.error(f"Failed to parse message: {str(e)}")
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid message format')
        }
    
    pending_message_count = get_pending_message_count()
    
    if pending_message_count > 1:
        time.sleep(5)
    
    if (any((char.isdigit() for char in content)) and message_data.get('sender') != "admin"):
        print("Message contains a number, forwarding to admin.")
        
        message_for_admin = message_data.copy()
        message_for_admin['receiver'] = "admin"
        
        send_to_processed_queue(message_data)
        
        send_to_processed_queue(message_for_admin)
    else:
        send_to_processed_queue(message_data)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Message processed successfully')
    }

def send_to_processed_queue(message):
    try:
        response = sqs_client.send_message(
            QueueUrl=PROCESSED_MESSAGES_QUEUE_URL,
            MessageGroupId="messageGroupId",
            MessageBody=json.dumps(message)
        )
    except Exception as e:
        logging.error(f"Failed to send message to processed queue: {str(e)}")
