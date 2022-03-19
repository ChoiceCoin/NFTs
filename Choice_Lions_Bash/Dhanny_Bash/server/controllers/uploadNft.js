import PinataApi from './PinataApi';

const api = new PinataApi({
    api_key: process.env.PINATA_API_KEY,
    secret_key: process.env.PINATA_SECRET_KEY
});

export const uploadNft = async(req, res) => {
    try{
        const { asset, assetName } = req.body;
        console.log('Asset: ', asset);
        console.log('AssetName: ', assetName);
        let data = {
            'name': assetName,
            'meta': {
                Source: 'Choice Coin'
            }
        }
        await api.pinFileToIPFS(filePath, data)
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
    } catch (error) {
        console.log(error)
        throw new Error('An error occured')
    }
}

// export default uploadNft;