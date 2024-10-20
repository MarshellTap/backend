module.exports = (base64String) => {
    const parts = base64String.split(',');
    const mimeType = parts[0].split(':')[1].split(';')[0];
    const data = Buffer.from(parts[1], 'base64');
    const fileSizeKB = data.length / 1024;
    return {
        mimeType,
        fileSizeKB,
        data
    };
}