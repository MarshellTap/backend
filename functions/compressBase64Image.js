const sharp = require("sharp");

module.exports = async (base64Image, quality = 80) => {
    try {
        const outputFormat = base64Image.split(';')[0].split('/')[1];
        const buffer = Buffer.from(base64Image.split(',')[1], 'base64');
        let compressedImage;
        if (outputFormat === 'jpeg') {
            compressedImage = await sharp(buffer)
                .jpeg({ quality })
                .resize({ width: 200, height: 200 })
                .toBuffer();
        } else if (outputFormat === 'png') {
            compressedImage = await sharp(buffer)
                .png({ colors: 256 })
                .resize({ width: 200, height: 200 })
                .toBuffer();
        } else {
            throw new Error(`Unsupported output format: ${outputFormat}`);
        }
        const compressedBase64 = compressedImage.toString('base64');
        return  {
            with_data: `data:image/${outputFormat};base64,${compressedBase64}`,
            without_data: compressedBase64
        };
    } catch (error) {
        console.error('Error during image compression:', error);
        return;
    }
}