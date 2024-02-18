from flask import Flask, request, json
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from flask_socketio import SocketIO, join_room, emit
from bson.objectid import ObjectId
from bson import json_util
from os import getenv
from dotenv import load_dotenv
from datetime import datetime
from colorist import red, green, yellow
import requests

# Initializing flask app
app = Flask(__name__)
CORS(app, origins=['https://house-homies.onrender.com', 'wss://house-homies.onrender.com', 'http://localhost:3000', 'wss://localhost:3000'])
socketio = SocketIO(app, allow_upgrades=False, cors_allowed_origins=['https://house-homies.onrender.com','wss://house-homies.onrender.com', 'http://localhost:3000', 'wss://localhost:3000'])

load_dotenv()
FLASK_ENV = getenv('FLASK_ENV')
if FLASK_ENV == 'production':
    DATABASE_URI = getenv('DATABASE_URI')
    client = MongoClient(DATABASE_URI, server_api=ServerApi('1'))
    DEBUG = False
else:
    client = MongoClient()
    DEBUG = True
    print('connected to dev database')

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.househomies
receipts = db.receipts
users = db.users

"""
Sockets
"""
@socketio.on('connect')
def on_connect():
    green(f'User {request.sid} has connected')

@socketio.on('disconnect')
def on_disconnect():
    red(f'User {request.sid} has disconnected')

@socketio.on('join_receipt')
def handle_join_receipt(receiptID):
    join_room(receiptID, request.sid)
    yellow(f'User {request.sid} joined receipt {receiptID}')

@socketio.on('update_receipt')
def handle_receipt_update(data):
    body = {
            "$set": {
                "title": data['title'],
                "members": data['members'],
                "products": data['products'],
                "checks": data['checks'],
                "date": datetime.now()

            },
            "$addToSet": {}
        }
    if data['user']: body["$addToSet"]["emails"] = data["user"]["email"]
    
    receipts.update_one({"_id": ObjectId(data['receiptID'])}, body, upsert=True)

    emit('updated_receipt', 
        {"title": data['title'],
        "members": data['members'],
        "products": data['products'],
        "checks": data['checks'],
        },
        room=data['receiptID'],
        skip_sid=request.sid,
        to=data['receiptID']
    )

"""
User Account Endpoints
GET /users/<user>/receipts
"""

@app.get("/users/<email>/receipts")
def get_user_receipts(email):
    print(email)
    try:
        cursor = receipts.find({"emails": {"$in": [email]}})
        return json.loads(json_util.dumps(cursor))
    except IndexError:
        return 'No receipts found for user', 404

@app.put("/users/<receiptID>")
def update_receipt_by_user(receiptID):
    try:
        body = {"$addToSet": {}}
        if request.json['user']: body["$addToSet"]["emails"] = request.json['user']['email']
        print(body)
        receipts.update_one({"_id": ObjectId(receiptID)}, body)

        return receiptID
    except:
        return 415
    
"""
Receipt Endpoints
GET /receipts/<id> 
POST /receipts
PUT /receipts/<id>
"""
@app.get("/receipts/<id>")
def get_receipt(id):
    try:
        cursor = receipts.find(
            {"_id": ObjectId(id)}
        )
        return json.loads(json_util.dumps(cursor[0]))
    except IndexError:
        return 'No receipt found', 404
    
@app.post("/receipts")
def save_receipt():
    owner = request.json['owner']
    title = request.json['title']
    members = request.json["members"]
    products = request.json["products"]
    checks = request.json["checks"]
    debt = request.json["debt"]
    res = receipts.insert_one(
        {
            "owner": owner,
            "title": title,
            "members": members,
            "products": products,
            "checks": checks,
            "debt": debt,
            "date": datetime.now()
        }
    )

    print(owner)
    if owner:
        print('owner')
        users.update_one(
            {"username": owner},
            {'$push': {'receipts': res.inserted_id}}
        )

    return str(res.inserted_id), 200

@app.put("/receipts/<id>")
def update_receipt(id):
    owner = request.json['owner']
    title = request.json['title']
    members = request.json["members"]
    products = request.json["products"]    
    checks = request.json["checks"]
    debt = request.json["debt"]
    res = receipts.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "title": title,
                "members": members,
                "products": products,
                "checks": checks,
                "debt": debt,
            }
        },
    )
    if not res.acknowledged:
        return 'Update failed', 409
    
    if owner:
        users.update_one(
            {"username": owner},
            {'$addToSet': {'receipts': ObjectId(id)}}
        )

    return id


"""
Default
"""
@app.route('/')
def default():
    return 'HouseHomies-backend'

def get_public_ip():
    try:
        response = requests.get('https://api.ipify.org?format=json')
        if response.status_code == 200:
            data = response.json()
            green(f"Fetched public ip as {data['ip']}")
            return data['ip']
        else:
            red(f"Failed to fetch public IP: {response.status_code}")
            return '0.0.0.0'
    except Exception as e:
        red(f"An error occurred: {e}")
        return '0.0.0.0'

def create_app():
    app = Flask(__name__)
    CORS(app, origins=['https://house-homies.onrender.com', 'wss://house-homies.onrender.com', 'http://localhost:3000', 'wss://localhost:3000'])
    socketio = SocketIO(app, allow_upgrades=False, cors_allowed_origins=['https://house-homies.onrender.com','wss://house-homies.onrender.com', 'http://localhost:3000', 'wss://localhost:3000'])
    return socketio

# Running app
if __name__ == "__main__":
    # app = create_app()
    socketio.run(app, debug=DEBUG, host='0.0.0.0', port=10000)
