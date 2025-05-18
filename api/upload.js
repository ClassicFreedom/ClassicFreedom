import { writeFile } from 'fs/promises';
import { join } from 'path';
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = formidable({
            uploadDir: join(process.cwd(), 'public/images/posts'),
            keepExtensions: true,
            maxFileSize: 5 * 1024 * 1024, // 5MB limit
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Upload error:', err);
                return res.status(500).json({ error: 'Upload failed' });
            }

            const file = files.image;
            if (!file) {
                return res.status(400).json({ error: 'No image provided' });
            }

            // Move the file to the correct location
            const targetPath = join(process.cwd(), 'public/images/posts', file.originalFilename);
            await writeFile(targetPath, await readFile(file.filepath));

            // Return the public URL
            res.status(200).json({ 
                url: `/images/posts/${file.originalFilename}` 
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
} 