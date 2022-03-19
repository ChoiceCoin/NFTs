#!/usr/bin/env python3

import os

from flask import Flask, render_template, jsonify, request
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

cloudinary.config( 
  cloud_name = os.getenv('CLOUD_NAME'),
  api_key = os.getenv('API_KEY'), 
  api_secret = os.getenv('API_SECRET')
)



app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'secretkey'
app.config['ALLOWED_EXTENSIONS'] = ["PNG","JPG","JPEG","GIF"]


def upload(file):
    try:
        print('Uploading file')
        response = cloudinary.uploader.upload(file)
        print(response['secure_url'])
        print('Uploaded')
        return response
    except Exception as e:
        print('Error occured: ', str(e))
        return False

def allowed_nft(filename):
    if not "." in filename:
        return False
    ext = filename.rsplit('.', 1)[1]
    if ext.upper() in app.config["ALLOWED_EXTENSIONS"]:
        return True
    return False

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=["POST"])
def upload():
    try:
        if request.files:
            nft = request.files['nftFile']
            if nft.filename == "":
                print("File must have a filename")
                return jsonify({"error":"File must have a filename"})
            if not allowed_nft(nft.filename):
                print("File extension is not allowed")
                return jsonify({"error":"File extension is not allowed"})
            response = upload(nft)
            if response:
                return jsonify({"success": response})
        return jsonify({"error": "error occured"})
    except Exception as e:
        print("Error: " + str(e))
        return jsonify({"error":"An error occured"})

app.run()
