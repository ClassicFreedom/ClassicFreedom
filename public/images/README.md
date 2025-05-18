# Default Images

This directory contains default images used throughout the website.

## Required Images

- `default-thumbnail.jpg`: Default thumbnail image for posts (400x225 pixels)
  - Used when a post doesn't have its own thumbnail
  - Used as fallback for invalid image URLs
  - Features a professional library/books stock photo from Unsplash
  - Image dimensions: 400x225 pixels
  - Credit: Tom Hermans on Unsplash

## Updating Default Images

To update the default thumbnail:
1. Run `node scripts/setup-default-image.js` to download the default stock photo
2. Or replace `default-thumbnail.jpg` with your own 400x225 image

Please ensure any replacement images maintain the specified dimensions to preserve consistent layout throughout the site. 