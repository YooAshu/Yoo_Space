import multer from 'multer'


// middleware to upload file on local path returns local file path to pass on uploadOnCloudinary function
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/tmp')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage
})