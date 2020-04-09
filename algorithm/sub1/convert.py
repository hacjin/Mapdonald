import pandas as pd
import os
import json
DATA_DIR = '../data'
DATA_FILE = os.path.join(DATA_DIR, "data.json")

with open(DATA_FILE, encoding='UTF-8') as f:
    json_data = json.loads(f.read())
    # data = json_data[0]


df = pd.DataFrame(json_data)
df.to_csv('out.csv', header=True, index=True, encoding='UTF-8')
