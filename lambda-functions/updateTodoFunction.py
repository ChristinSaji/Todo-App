import json
import boto3
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
                'Access-Control-Allow-Methods': 'PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps(body)
        }

    if event['requestContext']['http']['method'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps('CORS preflight response')
        }

    if event['requestContext']['http']['method'] == 'PUT':
        try:
            body = json.loads(event['body'])
            todo_id = body['id']
            task = body['task']
            
            update_expression = "SET task = :task"
            expression_attribute_values = {':task': task}
            
            if 'attachment' in body:
                attachment = body['attachment']
                attachment_filename = attachment['filename']
                attachment_content = b64decode(attachment['content'])
                attachment_key = f'todos/{todo_id}/{attachment_filename}'
                s3.put_object(Bucket=bucket_name, Key=attachment_key, Body=attachment_content)
                update_expression += ", attachment = :attachment"
                expression_attribute_values[':attachment'] = attachment_key

            table.update_item(
                Key={'id': todo_id},
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
            )
            return get_response(200, 'To-Do updated successfully')
        except ClientError as e:
            return get_response(400, f'Error updating to-do: {e.response["Error"]["Message"]}')
        except Exception as e:
            return get_response(500, f'Internal server error: {str(e)}')

    return get_response(400, 'Unsupported method')
