export const serverConfig = {
    remoteUrl: process.env.REACT_APP_REMOTE_URL, //'/api'
    imageUrl: process.env.REACT_APP_ASSET_URL, //  '/var/{imagepath}'
    imageThumbnailUrl: process.env.REACT_APP_THUMB_PATH, //  '/var/images/thumbnail/{imagepath}'
    fileUrl: process.env.REACT_APP_FILE_URL,// '/var/{filepath}',
}

export const setServerConfig = (c: typeof serverConfig)=>{    
    Object.keys(c).forEach(k=>{
        serverConfig[k] = c[k];
    })
}