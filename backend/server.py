from flask import Flask, request, json, current_app, g
from flask_cors import CORS
from werkzeug.local import LocalProxy
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
from bson import json_util
from os import getenv
from dotenv import load_dotenv

# Initializing flask app
app = Flask(__name__)
CORS(app, origins=['https://house-homies.onrender.com', 'http://localhost:3000'])

load_dotenv()
FLASK_ENV = getenv('FLASK_ENV')
if FLASK_ENV == 'production':
    DATABASE_URI = getenv('DATABASE_URI')
    client = MongoClient(DATABASE_URI, server_api=ServerApi('1'))
else:
    client = MongoClient()
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
User Account Endpoints
GET /users/<user>/receipts
"""

@app.get("/users/<user>/receipts")
def get_user_receipts(user):
    try:
        cursor = receipts.find({'owner': user})
        return json.loads(json_util.dumps(cursor))
    except IndexError:
        return 'No receipts found for user'

"""
Receipt Endpoints
GET /receipts/<id> 
POST /receipts
PUT /receipts/<id>
"""
@app.get("/receipts/<id>")
def get_receipt(id):
    cursor = receipts.find(
        {"_id": ObjectId(id)}
    )
    return json.loads(json_util.dumps(cursor[0]))

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
        }
    )

    print(owner)
    if owner:
        print('owner')
        users.update_one(
            {"username": owner},
            {'$push': {'receipts': res.inserted_id}}
        )

    return str(res.inserted_id)

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

# Running app
if __name__ == "__main__":
    app.run(debug=True)
