import axios from "axios";
import dotenv from 'dotenv';
import util from 'util';
import fs from 'fs';
import FormData from 'form-data';

dotenv.config()


class PinataApi {
    constructor(option) {
        this.baseURL = `https://api.pinata.cloud`;
        this.axios = axios.create({
            baseURL: this.baseURL,
            setTimeout: '3000',
            headers: {
                'pinata_api_key': process.env.PINATA_API_KEY,
                'pinata_secret_api_key': process.env.PINATA_SECRET_KEY
            }
        })
        this.axios.interceptors.response.use(function (response) {
            return response && response.data ? response.data : null
        }, function (error) {
            console.log(util.inspect(error));
            return Promise.reject(error && error.response ? error.response.data : error)
        });
    }

    testAuthentication(){
        this.axios.get('/data/testAuthentication')
        .then(function (response) {
            console.log(response['message'])
            //handle your response here
        })
        .catch(function (error) {
            //handle error here
            console.log(error)
        });
    }

    pinFileToIPFS(filePath) {
        let data = new FormData();
        if (fs.existsSync(filePath)) {
            console.log('File exists: ', filePath)
        } else {
            console.log('Does not exist: ', filePath)
            process.exit(1)
        }
        let options = {
            pinataMetadata: {
                name: 'CigaPunk',
                keyvalues: {
                    ItemID: 'Item001',
                    CheckpointID: 'Checkpoint002',
                    Source: 'CompanyA',
                    WeightInKilos: 5.25
                }
            }
        }
        data.append('file', fs.createReadStream(filePath))
        if (options) {
            if (options.pinataMetadata) {                
                data.append('pinataMetadata', JSON.stringify(options.pinataMetadata));
            }
            if (options.pinataOptions) {
                data.append('pinataOptions', JSON.stringify(options.pinataOptions));
            }
        }
        this.axios.post('/pinning/pinFileToIPFS', data, {
            withCredentials: true,
            maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary= ${data._boundary}`
            }
        })
        .then(function (response){
            console.log(response)
        })
        .catch(function (error) {
            console.log(error)
        })
        
    }

}


const api = new PinataApi()
api.pinFileToIPFS('./1.jpg')
