import time
import json
import logging
import boto3
import os

# Inicjalizacja klienta SQS
sqs_client = boto3.client('sqs')

# Nazwy kolejek SQS
# Pobieranie zmiennych środowiskowych z Terraform
PENDING_MESSAGES_QUEUE_URL = os.environ['PENDING_QUEUE_URL']
PROCESSED_MESSAGES_QUEUE_URL = os.environ['PROCESSED_QUEUE_URL']

# Ustawienia logowania
logging.basicConfig(level=logging.INFO)

def lambda_handler(event, context):
    # Logowanie przyjętej wiadomości
    logging.info(f"Received event: {json.dumps(event)}")
    
    # Pobieranie wiadomości z eventu
    message_body = event['Records'][0]['body']
    
    # Zakładamy, że wiadomość jest w formacie JSON i zawiera pole 'content'
    try:
        message_data = json.loads(message_body)
        content = message_data.get('content', '')
    except Exception as e:
        logging.error(f"Failed to parse message: {str(e)}")
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid message format')
        }

    # Wprowadzenie 5-sekundowego opóźnienia
    time.sleep(5)
    
    # Sprawdzamy, czy wiadomość zawiera liczbę w treści
    if any(char.isdigit() for char in content):
        logging.info("Message contains a number, forwarding to admin.")
        
        # Tworzymy kopię wiadomości zmieniając adresata na "admin"
        message_for_admin = message_data.copy()
        message_for_admin['receiver']['username'] = 'admin'
        
        # Wysyłamy wiadomość do kolejki przetworzonych
        send_to_processed_queue(message_data)
        
        # Wysyłamy kopię wiadomości do admina
        send_to_processed_queue(message_for_admin)
    else:
        # Jeśli wiadomość nie zawiera liczby, po prostu ją wysyłamy do kolejki przetworzonych
        send_to_processed_queue(message_data)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Message processed successfully')
    }

def send_to_processed_queue(message):
    """
    Wysyła wiadomość do kolejki przetworzonych wiadomości
    """
    try:
        response = sqs_client.send_message(
            QueueUrl=PROCESSED_MESSAGES_QUEUE_URL,
            MessageGroupId="messageGroupId",
            MessageBody=json.dumps(message)  # Wiadomość jest teraz JSON-em
        )
        logging.info(f"Message sent to processed queue. Message ID: {response['MessageId']}")
    except Exception as e:
        logging.error(f"Failed to send message to processed queue: {str(e)}")
