const https = require('https');
const fs = require('fs');
const path = require('path');

// Using a free stock photo from Unsplash
const imageUrl = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=225&fit=crop&q=80';
const outputPath = path.join(__dirname, '..', 'public', 'images', 'default-thumbnail.jpg');

// Ensure the images directory exists
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

console.log('Downloading default thumbnail image...');

https.get(imageUrl, (response) => {
    if (response.statusCode !== 200) {
        console.error(`Failed to download image: ${response.statusCode} ${response.statusMessage}`);
        return;
    }

    const fileStream = fs.createWriteStream(outputPath);
    response.pipe(fileStream);

    fileStream.on('finish', () => {
        console.log('Default thumbnail image has been downloaded and saved.');
        console.log(`Location: ${outputPath}`);
        fileStream.close();
    });
}).on('error', (err) => {
    console.error('Error downloading the image:', err.message);
}); 