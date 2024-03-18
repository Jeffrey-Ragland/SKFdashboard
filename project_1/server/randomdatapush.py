import requests
import random
import time

baseUrl = 'http://localhost:3001'

bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTA3MzkyODIsImV4cCI6MTcxMDgyNTY4Mn0.aTtSpMBn2kRBIlXeV_e4Rsh0lMgQ9QuddAT27XrdpXw'

def generateSensorData():
    sensorData = {
        'Sensor1' : random.randint(1,100),
        'Sensor2' : random.randint(1,100),
        'Sensor3' : random.randint(1,100),
        'Sensor4' : random.randint(1,100),
        'Sensor5' : random.randint(1,100)
    }
    return sensorData

def pushData():
    url = f'{baseUrl}/create'
    sensorData = generateSensorData()
    headers = {'Authorization':f'Bearer {bearerToken}'}
    response = requests.get(url, params=sensorData, headers=headers)
    print(response.json())

while True:
    pushData()
    time.sleep(1)
