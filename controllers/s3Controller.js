const { v4: uuidv4 } = require("uuid"); // to generate random strings to use as links.
const generateUploadURL = require("../lib/s3");

const getUniqueS3Url = async (req, res) => {
    try{
        const { folder = "products" } = req.query; //If folder not specified, defaults to products folder
        const filename = `${folder}/${uuidv4()}.jpg`; // Generates a random filename in the folder specified
        const url = await generateUploadURL(filename); // Generates a random link to upload the image using that filename
        res.json({ url });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error generating S3 upload URL"});
    }
};

module.exports = getUniqueS3Url;