

export async function uploadNFT(asset, assetName) {
    const formData = new FormData()
    
    formData.append('asset', asset)
    formData.append('assetName', assetName)
    const fetchOptions = {
        method: 'POST',
        body: formData
    };
    return await fetch('/upload', fetchOptions)
    .then((res) => res.json())
    .catch(() => ({
        error: { message: "Unable to connect to server. Please try again" }
    }))
}