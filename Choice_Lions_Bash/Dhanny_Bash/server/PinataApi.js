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
                'pinata_api_key': option.api_key,
                'pinata_secret_api_key': option.secret_key
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
        return this.axios.get('/data/testAuthentication')
    }

    pinFileToIPFS(filePath, data) {
        let formData = new FormData();
        if (fs.existsSync(filePath)) {
            console.log('File exists: ', filePath)
        } else {
            console.log('Does not exist: ', filePath)
            throw new Error("File Does not exist")
        }
        let options = {
            pinataMetadata: {
                name: data['name'],
                keyvalues: data['meta']
            }
        }
        formData.append('file', fs.createReadStream(filePath))
        if (options) {
            if (options.pinataMetadata) {                
                formData.append('pinataMetadata', JSON.stringify(options.pinataMetadata));
            }
        }
        return this.axios.post('/pinning/pinFileToIPFS', formData, {
            withCredentials: true,
            maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary= ${formData._boundary}`
            }
        })
    }

}

export default PinataApi;
