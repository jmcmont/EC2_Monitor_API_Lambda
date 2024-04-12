import json
import boto3


ec2 = boto3.resource('ec2')

def lambda_handler(event, context):
    
    print(event)
    
    if event['httpMethod'] == 'GET' and event['path'] == '/get_instances':
        response = getAllInstances()
        return response
    elif event['httpMethod'] == 'POST' and event['path'] == '/action_instances':
        print(event)
        response = startStopInstances(event['instanceId'],event['action'])
        return response
    else:
        return {
            'status': 404,
            'message': 'No se encontró el recurso solicitado.'
        }
        
def getAllInstances():
    
    try:
        
        instances = ec2.instances.all()
            
        instancesData = [
            {
                "InstanceId": instance.instance_id,
                "State": instance.state['Name'],
                "Name": next((tag['Value'] for tag in instance.tags if tag['Key'] == 'Name'), "Sin nombre"),
                "PublicIP": instance.public_ip_address,
                "PublicDNS": instance.public_dns_name,
                "PrivateIP": instance.private_ip_address
            } 
            for instance in instances
        ]
        
        return {
            'status': 200,
            'instances': instancesData
        }
    
    except Exception as e:
        
        return {
            'status': 500,
            'message': 'No se realizó la consulta de las instancias'
        }
     
    
def startStopInstances(instanceId,action):
    
    try:
        
        instance = ec2.Instance(instanceId)
        
        if action == 'Stop':
            
            instance.stop()
            
            return {
                'status': 200,
                'message': 'Instancia detenida.'
            }
            
        elif action == 'Start':
            
            instance.start()
            
            return {
                'status': 200,
                'message': 'Instancia iniciada.'
            }
        
    except Exception as e:
        return {
            'status': 500,
            'message': 'No se realizó la accion'
        }
    
