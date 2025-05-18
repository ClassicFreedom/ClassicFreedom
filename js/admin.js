// Admin credentials from runtime config
let ADMIN_USER, ADMIN_PASS;

// Function to fetch runtime config
async function loadConfig() {
    try {
        const response = await fetch('/_env');
        const config = await response.json();
        ADMIN_USER = config.NEXT_PUBLIC_ADMIN_USERNAME;
        ADMIN_PASS = config.NEXT_PUBLIC_ADMIN_PASSWORD;
    } catch (error) {
        console.warn('Could not load runtime config, using development credentials');
        ADMIN_USER = 'classicfreedom';
        ADMIN_PASS = 'primus1984';
    }
}

// Load config before initializing
loadConfig().then(() => {
    // Initialize the rest of the admin functionality
    checkLoginStatus();
});

// DOM Elements
const loginForm = document.getElementById('loginForm');
const adminPanel = document.getElementById('adminPanel');
const adminLoginForm = document.getElementById('adminLoginForm');
const socialLinksForm = document.getElementById('socialLinksForm');
const logoutBtn = document.getElementById('logoutBtn');
const loginError = document.getElementById('loginError');
const saveStatus = document.getElementById('saveStatus');

// Posts Elements
const postsPanel = document.getElementById('postsPanel');
const socialPanel = document.getElementById('socialPanel');
const postsTabBtn = document.getElementById('postsTabBtn');
const socialTabBtn = document.getElementById('socialTabBtn');
const postsList = document.getElementById('postsList');
const postForm = document.getElementById('postForm');
const addPostBtn = document.getElementById('addPostBtn');
const cancelPostBtn = document.getElementById('cancelPostBtn');
const postFormTitle = document.getElementById('postFormTitle');

// Helper function to safely interact with localStorage
function safeLocalStorage(action, key, value = null) {
    try {
        if (action === 'get') {
            return localStorage.getItem(key);
        } else if (action === 'set') {
            localStorage.setItem(key, value);
            return true;
        } else if (action === 'remove') {
            localStorage.removeItem(key);
            return true;
        }
    } catch (error) {
        console.error('localStorage error:', error);
        return null;
    }
}

// URL validation
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Check if user is already logged in
function checkLoginStatus() {
    const isLoggedIn = safeLocalStorage('get', 'adminLoggedIn') === 'true';
    loginForm.style.display = isLoggedIn ? 'none' : 'block';
    adminPanel.style.display = isLoggedIn ? 'block' : 'none';
    
    if (isLoggedIn) {
        loadSocialLinks();
        loadPosts();
    }
}

// Handle login with rate limiting
let loginAttempts = 0;
let lastLoginAttempt = 0;

adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Rate limiting
    const now = Date.now();
    if (now - lastLoginAttempt < 2000) {
        loginError.textContent = 'Please wait before trying again';
        loginError.classList.remove('hidden');
        return;
    }
    
    if (loginAttempts >= 5) {
        loginError.textContent = 'Too many attempts. Please try again later.';
        loginError.classList.remove('hidden');
        return;
    }
    
    lastLoginAttempt = now;
    loginAttempts++;
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        safeLocalStorage('set', 'adminLoggedIn', 'true');
        loginAttempts = 0;
        loginError.classList.add('hidden');
        checkLoginStatus();
    } else {
        loginError.textContent = 'Invalid credentials';
        loginError.classList.remove('hidden');
    }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    safeLocalStorage('remove', 'adminLoggedIn');
    checkLoginStatus();
    loginAttempts = 0;
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});

// Tab switching
postsTabBtn.addEventListener('click', () => {
    postsTabBtn.classList.add('bg-[#0d9488]', 'text-white');
    socialTabBtn.classList.remove('bg-[#0d9488]', 'text-white');
    postsPanel.classList.remove('hidden');
    socialPanel.classList.add('hidden');
});

socialTabBtn.addEventListener('click', () => {
    socialTabBtn.classList.add('bg-[#0d9488]', 'text-white');
    postsTabBtn.classList.remove('bg-[#0d9488]', 'text-white');
    socialPanel.classList.remove('hidden');
    postsPanel.classList.add('hidden');
});

// Posts Management
let editingPostId = null;

function createPostElement(post) {
    const div = document.createElement('div');
    div.className = 'border rounded-lg p-4 flex items-start gap-4 bg-white';
    div.innerHTML = `
        <div class="w-24 h-24 flex-shrink-0">
            <img src="${post.thumbnail || 'images/posts/default-thumbnail.jpg'}" alt="${post.title}" class="w-full h-full object-cover rounded">
        </div>
        <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
                <span class="text-sm text-[#0284c7] font-semibold">${post.category}</span>
                <span class="text-sm text-gray-500">${post.date || 'No date'}</span>
            </div>
            <h3 class="text-xl font-bold">${post.title}</h3>
            <p class="text-gray-600 mt-1">${post.description}</p>
        </div>
        <div class="flex gap-2">
            <button class="edit-post-btn text-[#0d9488] hover:text-[#0d9488]/80">Edit</button>
            <button class="delete-post-btn text-red-600 hover:text-red-800">Delete</button>
        </div>
    `;

    // Add event listeners
    div.querySelector('.edit-post-btn').addEventListener('click', () => editPost(post));
    div.querySelector('.delete-post-btn').addEventListener('click', () => deletePost(post.id));

    return div;
}

function loadPosts() {
    let posts = JSON.parse(safeLocalStorage('get', 'posts') || '[]');
    
    // If no posts exist, create placeholder posts
    if (posts.length === 0) {
        const placeholderPosts = [
            {
                id: Date.now(),
                title: "Mastering Bitcoin for Daily Use",
                category: "Crypto",
                description: "A quick-start guide for using crypto as a digital nomad.",
                date: "March 27, 2024",
                thumbnail: "images/posts/crypto-bitcoin.jpg"
            },
            {
                id: Date.now() + 1,
                title: "Setting Up Your Digital Office",
                category: "Remote Work",
                description: "Essential tools and practices for remote work success.",
                date: "March 20, 2024",
                thumbnail: "images/posts/remote-office.jpg"
            },
            {
                id: Date.now() + 2,
                title: "Digital Nomad Destinations 2024",
                category: "Travel",
                description: "Top cities for remote workers this year.",
                date: "March 13, 2024",
                thumbnail: "images/posts/nomad-destinations.jpg"
            },
            {
                id: Date.now() + 3,
                title: "Tax Strategies for Nomads",
                category: "Finance",
                description: "Understanding international tax implications.",
                date: "March 6, 2024",
                thumbnail: "images/posts/tax-strategy.jpg"
            },
            {
                id: Date.now() + 4,
                title: "Building Community on the Road",
                category: "Lifestyle",
                description: "Connecting with fellow digital nomads worldwide.",
                date: "February 28, 2024",
                thumbnail: "images/posts/community.jpg"
            },
            {
                id: Date.now() + 5,
                title: "Essential Digital Security",
                category: "Technology",
                description: "Staying safe while working remotely.",
                date: "February 21, 2024",
                thumbnail: "images/posts/default-thumbnail.jpg"
            }
        ];
        
        // Save placeholder posts
        safeLocalStorage('set', 'posts', JSON.stringify(placeholderPosts));
        posts = placeholderPosts;
    }

    postsList.innerHTML = '';
    posts.forEach(post => {
        postsList.appendChild(createPostElement(post));
    });
}

function savePosts(posts) {
    safeLocalStorage('set', 'posts', JSON.stringify(posts));
    loadPosts();
    // Trigger an event to update the main page
    window.dispatchEvent(new CustomEvent('postsUpdated', { detail: posts }));
}

function showPostForm(show = true) {
    postForm.classList.toggle('hidden', !show);
    postsList.classList.toggle('hidden', show);
    addPostBtn.classList.toggle('hidden', show);
}

addPostBtn.addEventListener('click', () => {
    editingPostId = null;
    postFormTitle.textContent = 'Add New Post';
    postForm.reset();
    showPostForm(true);
});

cancelPostBtn.addEventListener('click', () => {
    showPostForm(false);
});

function editPost(post) {
    editingPostId = post.id;
    postFormTitle.textContent = 'Edit Post';
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postDescription').value = post.description;
    document.getElementById('postContent').value = post.content || '';
    document.getElementById('postLink').value = post.link || '';
    if (document.getElementById('postDate')) {
        document.getElementById('postDate').value = post.date || '';
    }
    showPostForm(true);
}

function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        const posts = JSON.parse(safeLocalStorage('get', 'posts') || '[]');
        const updatedPosts = posts.filter(p => p.id !== postId);
        savePosts(updatedPosts);
    }
}

// Function to handle image upload and save
async function handleImageUpload(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            reject('Not an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            // Create an image element to check dimensions
            const img = new Image();
            img.onload = function() {
                // Create a canvas to potentially resize the image
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // If image is too large, resize it
                const MAX_WIDTH = 1200;
                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and export the image
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Generate a unique filename
                const timestamp = new Date().getTime();
                const safeFileName = file.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const filename = `image-${timestamp}-${safeFileName}`;
                const filepath = `/images/posts/${filename}`;

                // Convert to blob
                canvas.toBlob(async (blob) => {
                    try {
                        // Create FormData and append the file
                        const formData = new FormData();
                        formData.append('image', blob, filename);

                        // Upload the image to the server
                        const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData
                        });

                        if (!response.ok) {
                            throw new Error('Failed to upload image');
                        }

                        // Return the public URL of the image
                        resolve(filepath);
                    } catch (error) {
                        console.error('Error uploading image:', error);
                        reject(error);
                    }
                }, file.type, 0.8);
            };
            img.onerror = function() {
                reject('Error loading image');
            };
            img.src = e.target.result;
        };
        reader.onerror = function() {
            reject('Error reading file');
        };
        reader.readAsDataURL(file);
    });
}

// Function to load saved images
function loadSavedImages() {
    const savedImages = JSON.parse(localStorage.getItem('savedImages') || '{}');
    Object.entries(savedImages).forEach(([path, data]) => {
        // Find all img elements with this source
        document.querySelectorAll(`img[src="${path}"]`).forEach(img => {
            img.src = data;
        });
    });
}

// Update post form to handle image upload
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const thumbnailInput = document.getElementById('postThumbnail');
        const file = thumbnailInput.files[0];
        let thumbnail = null;

        if (file) {
            thumbnail = await handleImageUpload(file);
        }

        const posts = JSON.parse(safeLocalStorage('get', 'posts') || '[]');
        const newPost = {
            id: editingPostId || Date.now(),
            title: document.getElementById('postTitle').value.trim(),
            category: document.getElementById('postCategory').value.trim(),
            description: document.getElementById('postDescription').value.trim(),
            content: document.getElementById('postContent').value.trim(),
            link: document.getElementById('postLink').value.trim(),
            date: document.getElementById('postDate').value || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            thumbnail: thumbnail || (editingPostId ? posts.find(p => p.id === editingPostId)?.thumbnail : null) || 'images/posts/default-thumbnail.jpg'
        };

        if (editingPostId) {
            const index = posts.findIndex(p => p.id === editingPostId);
            if (index !== -1) {
                posts[index] = { ...posts[index], ...newPost };
            }
        } else {
            posts.push(newPost);
        }

        savePosts(posts);
        showPostForm(false);
    } catch (error) {
        console.error('Error handling image:', error);
        alert('There was an error processing the image. Please try again.');
    }
});

// Add image preview functionality
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadSavedImages();
    
    // Add date field and set up image preview
    const postForm = document.getElementById('postForm');
    if (postForm) {
        // Update file input to accept webp
        const thumbnailInput = document.getElementById('postThumbnail');
        const thumbnailPreview = document.getElementById('thumbnailPreview');
        const previewImg = thumbnailPreview?.querySelector('img');

        if (thumbnailInput && thumbnailPreview && previewImg) {
            thumbnailInput.accept = "image/webp,image/png,image/jpeg,image/gif";
            
            // Handle file selection for preview
            thumbnailInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        const preview = await handleImageUpload(file);
                        previewImg.src = preview;
                        thumbnailPreview.classList.remove('hidden');
                    } catch (error) {
                        console.error('Error previewing image:', error);
                        thumbnailPreview.classList.add('hidden');
                    }
                } else {
                    thumbnailPreview.classList.add('hidden');
                }
            });
        }

        if (!document.getElementById('postDate')) {
            const dateField = document.createElement('div');
            dateField.innerHTML = `
                <label class="block text-sm font-medium mb-1" for="postDate">Publication Date</label>
                <input type="text" id="postDate" class="w-full px-3 py-2 border rounded-lg" placeholder="e.g., March 27, 2024">
            `;
            // Insert before the Link field
            const linkField = document.querySelector('label[for="postLink"]').parentElement;
            linkField.parentElement.insertBefore(dateField, linkField);
        }
    }
});

// Social Media Management
function loadSocialLinks() {
    try {
        const socialLinks = JSON.parse(safeLocalStorage('get', 'socialLinks') || '{}');
        
        ['twitter', 'instagram', 'youtube'].forEach(platform => {
            const input = document.getElementById(platform);
            input.value = socialLinks[platform] || '';
        });
    } catch (error) {
        console.error('Error loading social links:', error);
        saveStatus.textContent = 'Error loading saved links';
        saveStatus.className = 'text-sm text-red-600';
    }
}

socialLinksForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const socialLinks = {};
    let hasErrors = false;

    ['twitter', 'instagram', 'youtube'].forEach(platform => {
        const input = document.getElementById(platform);
        const url = input.value.trim();
        
        if (url && !isValidUrl(url)) {
            hasErrors = true;
            input.classList.add('border-red-500');
        } else {
            input.classList.remove('border-red-500');
            if (url) socialLinks[platform] = url;
        }
    });

    if (hasErrors) {
        saveStatus.textContent = 'Please fix the invalid URLs';
        saveStatus.className = 'text-sm text-red-600';
        return;
    }

    try {
        safeLocalStorage('set', 'socialLinks', JSON.stringify(socialLinks));
        saveStatus.textContent = 'Links saved successfully!';
        saveStatus.className = 'text-sm text-green-600';
        
        // Trigger an event to update the main page
        window.dispatchEvent(new CustomEvent('socialLinksUpdated', { detail: socialLinks }));
        
        setTimeout(() => {
            saveStatus.textContent = '';
        }, 3000);
    } catch (error) {
        console.error('Error saving links:', error);
        saveStatus.textContent = 'Error saving links';
        saveStatus.className = 'text-sm text-red-600';
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    
    // Add date field to post form if it doesn't exist
    const postForm = document.getElementById('postForm');
    if (postForm && !document.getElementById('postDate')) {
        const dateField = document.createElement('div');
        dateField.innerHTML = `
            <label class="block text-sm font-medium mb-1" for="postDate">Publication Date</label>
            <input type="text" id="postDate" class="w-full px-3 py-2 border rounded-lg" placeholder="e.g., March 27, 2024">
        `;
        // Insert before the Link field
        const linkField = document.querySelector('label[for="postLink"]').parentElement;
        linkField.parentElement.insertBefore(dateField, linkField);
    }
}); 