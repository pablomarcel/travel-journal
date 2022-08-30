require('dotenv').config();
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require("multer-s3");

// const bucketName = process.env.AWS_BUCKET_NAME
// const accessKeyId = process.env.AWS_ACCESS_KEY
// const secretAccessKey = process.env.AWS_SECRET_KEY

let s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'tj-images',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    key: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    },
  }),
});

module.exports = {upload}