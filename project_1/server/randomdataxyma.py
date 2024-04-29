import requests
import random
import time

baseUrl = 'http://localhost:3001/backend/insertProjectData'

def generateRandomData():
    randomData = {
        'projectName' : 'xyma',
        'component1' : random.randint(1,100),
        'component2' : random.randint(1,100),
        'component3' : random.randint(1,100),
        'component4' : random.randint(1,100),
        'component5' : random.randint(1,100),
        'component6' : random.randint(1,100),
        'component7' : random.randint(1,100),
        'component8' : random.randint(1,100)
    }
    return randomData

def pushData():
    url = f'{baseUrl}'
    randomData = generateRandomData()
    response = requests.get(url, params=randomData)
    print(response.json())

while True:
    pushData()
    time.sleep(1)
