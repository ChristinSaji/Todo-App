import json
import boto3
import uuid
from botocore.exceptions import ClientError
from base64 import b64decode

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    s3 = boto3.client('s3')
    table = dynamodb.Table('Todos')
    bucket_name = 'serverless-todo-attachments'

    def get_response(status_code, body):
        return {
            'statusCode': status_code,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps(body)
        }

    if event['requestContext']['http']['method'] == 'OPTIONS':
        return get_response(200, 'OK')

    if event['requestContext']['http']['method'] == 'POST':
        try:
            body = json.loads(event['body'])
            todo_id = str(uuid.uuid4())
            task = body['task']
            date = body['date']

            attachment_key = None
            if 'attachment' in body:
                attachment = body['attachment']
                attachment_filename = attachment['filename']
                attachment_content = b64decode(attachment['content'])

                attachment_key = f'todos/{todo_id}/{attachment_filename}'
                s3.put_object(Bucket=bucket_name, Key=attachment_key, Body=attachment_content)

            table.put_item(
                Item={
                    'id': todo_id,
                    'task': task,
                    'date': date,
                    'attachment': attachment_key
                }
            )
            return get_response(200, 'To-Do added successfully')
        except ClientError as e:
            return get_response(400, f'Error adding to-do: {e.response["Error"]["Message"]}')
        except Exception as e:
            return get_response(500, f'Internal server error: {str(e)}')

    return get_response(400, 'Unsupported method')
