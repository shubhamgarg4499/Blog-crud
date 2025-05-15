function getPublicIdFromUrl(cloudinaryUrl) {
    try {
        // Step 1: Extract the part after "/upload/"
        let urlParts = cloudinaryUrl.split("/upload/");
        if (urlParts.length < 2) return null;

        // Step 2: Remove version number (v{digits}/)
        let path = urlParts[1].replace(/v\d+\//, "");

        // Step 3: Remove file extension (e.g., .jpg, .png)
        let publicId = path.replace(/\.[^/.]+$/, "");

        return publicId;
    } catch (error) {
        console.error("Error extracting public ID:", error);
        return null;
    }
}

module.exports = getPublicIdFromUrl