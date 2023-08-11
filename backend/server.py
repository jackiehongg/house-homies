from flask import Flask, render_template, request, url_for, redirect, json
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson import json_util

# Initializing flask app
app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'https://house-homies.onrender.com/'])

client = MongoClient("localhost", 27017)
db = client.househomies
receipts = db.receipts
users = db.users

@app.post("/login")
def login_account():

    try:
        print(request.json)
        username = request.json["username"]
        password = request.json["password"]

        if password:
            cursor = users.find({'username': username, 'password': password})
        else:
            cursor = users.find({'username': username})

        return json.loads(json_util.dumps(cursor[0]))
    except IndexError:
        return 'Username/Password combination not found', 400

@app.post("/register")
def register_account():
    username = request.json["username"]
    password = request.json["password"]

    cursor = users.find({"username": username})
    if len(list(cursor)) > 0:
        return 'Account already exists', 409
    
    cursor = users.insert_one(
        {
            "username": username,
            "password": password,
            "receipts": []
        }
    )
    cursor = users.find({"_id": cursor.inserted_id})
    return json.loads(json_util.dumps(cursor[0]))

@app.put("/<id>/save_changes")
def update_receipt(id):
    members = request.json["members"]
    products = request.json["products"]    
    checks = request.json["checks"]
    debt = request.json["debt"]
    res = receipts.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "members": members,
                "products": products,
                "checks": checks,
                "debt": debt,
            }
        },
    )
    if not res.acknowledged:
        return 'Update failed', 409
    return id

@app.post("/save_changes")
def save_receipt():
    username = request.json['username']
    members = request.json["members"]
    products = request.json["products"]
    checks = request.json["checks"]
    debt = request.json["debt"]
    res = receipts.insert_one(
        {
            "members": members,
            "products": products,
            "checks": checks,
            "debt": debt,
        }
    )

    users.update_one(
        {"username": username},
        {'$push': {'receipts': res.inserted_id}}
    )

    return str(res.inserted_id)

@app.get("/<id>/receipts")
def get_receipt(id):
    cursor = receipts.find(
        {"_id": ObjectId(id)}
    )

    return json.loads(json_util.dumps(cursor[0]))

@app.route('/')
def default():
    return 'HouseHomies-backend'

# Running app
if __name__ == "__main__":
    app.run(debug=True)
