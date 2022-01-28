import os

import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

cloudinary.config( 
  cloud_name = os.getenv('CLOUD_NAME'),
  api_key = os.getenv('CLOUD_API'), 
  api_secret = os.getenv('CLOUD_SECRET')
)


def upload(file):
    try:
        print('Uploading file')
        response = cloudinary.uploader.upload(file)
        print(response)
        print('Uploaded')
        return response
    except Exception as e:
        print('Error occured: ', str(e))
        return False

