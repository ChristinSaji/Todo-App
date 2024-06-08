import json
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Attr

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Todos')

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
        return get_response(200, 'OK')

    if event['requestContext']['http']['method'] == 'GET':
        try:
            if 'queryStringParameters' not in event or not event['queryStringParameters']:
                return get_response(400, 'Date parameter is missing')

            date = event['queryStringParameters'].get('date')
            if not date:
                return get_response(400, 'Date parameter is missing')

            response = table.scan(
                FilterExpression=Attr('date').eq(date)
            )
            todos = response['Items']
            return get_response(200, todos)
        except ClientError as e:
            return get_response(400, f'Error fetching to-dos: {e.response["Error"]["Message"]}')
        except Exception as e:
            return get_response(500, f'Internal server error: {str(e)}')

    return get_response(400, 'Unsupported method')
