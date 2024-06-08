import json
import boto3
from botocore.exceptions import ClientError

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
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps(body)
        }

    if event['requestContext']['http']['method'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps('CORS preflight response')
        }

    if event['requestContext']['http']['method'] == 'GET':
        try:
            response = table.scan()
            todos = response['Items']

            for todo in todos:
                if todo.get('attachment'):
                    attachment_key = todo['attachment']
                    signed_url = s3.generate_presigned_url('get_object', Params={'Bucket': bucket_name, 'Key': attachment_key}, ExpiresIn=3600)
                    todo['attachment'] = signed_url

            print("Todos fetched:", todos)
            return get_response(200, todos)
        except ClientError as e:
            return get_response(400, f'Error fetching to-dos: {e.response["Error"]["Message"]}')
        except Exception as e:
            return get_response(500, f'Internal server error: {str(e)}')

    return get_response(400, 'Unsupported method')
