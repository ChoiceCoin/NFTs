import express, { json, urlencoded } from 'express';
import multer from 'multer';

import PinataApi from './PinataApi.js';


const app = express()


app.use(json());
app.use(urlencoded({ extended: false }))

const api = new PinataApi({
    api_key: process.env.PINATA_API_KEY,
    secret_key: process.env.PINATA_SECRET_KEY
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'nfts');
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, originalname);
    }
})
const upload = multer({ storage: storage})

export const uploadNft = async(req, res) => {
    try{
        if (req.body !== undefined){
            const { assetName } = req.body;
            const asset = `./nfts/${req.file.filename}`
            let data = {
                    'name': assetName,
                    'meta': {
                        'Source': 'Choice',
                    }
            }
            await api.pinFileToIPFS(asset, data)
            .then(function (response){
                console.log(response)
                res.status(201).json({
                    success: {
                        response
                    }
                })
            })
            .catch(function (error) {
                console.log(error)
                throw new Error("An Error Occured")
            })
        }
        else {
            res.status(500).json({error: "No data sent"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "An error occured: ", error})
    }
}

// export default uploadNft;

app.post('/upload', upload.single('asset'), uploadNft)   

app.listen(process.env.PORT || 5000, () => {
    console.log(`Backend server is running: ${process.env.POR || 5000}`)
})