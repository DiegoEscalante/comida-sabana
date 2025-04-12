const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
    region: "us-east-2",
    credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function generateUploadURL(filename) { //Generates a URL so that the front can upload images to our comida-saban-images bucket in S3
    const command = new PutObjectCommand({
    Bucket: "comida-sabana-images",
    Key: filename,
    ContentType: "image/jpeg",
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 60 seconds
    return url;
}

module.exports = generateUploadURL;