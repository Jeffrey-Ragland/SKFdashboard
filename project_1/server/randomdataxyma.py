import requests
import random
import time

baseUrl = 'http://localhost:3001/backend/insertProjectData'

def generateRandomData():
    randomData = {
        'projectName' : 'cumi',
        's1' : random.randint(1,100),
        's2' : random.randint(1,100),
        's3' : random.randint(1,100),
        's4' : random.randint(1,100),
        's5' : random.randint(1,100),
        's6' : random.randint(1,100),
        's7' : random.randint(1,100),
        's8' : random.randint(1,100),
        's9' : random.randint(1,100),
        's10' : random.randint(1,100)

        # 'projectName' : 'xyma',
        # 'c1' : random.randint(1,100),
        # 'c2' : random.randint(1,100),
        # 'c3' : random.randint(1,100),
        # 'c4' : random.randint(1,100),
        # 'c5' : random.randint(1,100)
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
