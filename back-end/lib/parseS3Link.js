const parseS3Link = (s3Link) => {
    try {
        const url = new URL(s3Link); // Create a new URL object from the S3 link
        return `${url.origin}${url.pathname}`; // Return the origin and pathname to get the full URL
    } catch (error) {
        console.error("Invalid S3 link:", error); // Log the error for debugging
        return null; // Return null if the link is invalid
    }
}

module.exports = parseS3Link; 