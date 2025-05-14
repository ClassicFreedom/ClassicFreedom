// Admin credentials - in a real app, these would be on the server
const ADMIN_USER = "classicfreedom";
const ADMIN_PASS = "primus1984";

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
    postsPanel.classList.remove('hidden');
    socialPanel.classList.add('hidden');
    postsTabBtn.classList.add('bg-[#0d9488]', 'text-white');
    socialTabBtn.classList.remove('bg-[#0d9488]', 'text-white');
});

socialTabBtn.addEventListener('click', () => {
    socialPanel.classList.remove('hidden');
    postsPanel.classList.add('hidden');
    socialTabBtn.classList.add('bg-[#0d9488]', 'text-white');
    postsTabBtn.classList.remove('bg-[#0d9488]', 'text-white');
});

// Posts Management
let editingPostId = null;

function createPostElement(post) {
    const div = document.createElement('div');
    div.className = 'border rounded-lg p-4 flex justify-between items-start';
    div.innerHTML = `
        <div>
            <div class="flex items-center gap-2 mb-2">
                <span class="text-sm text-[#0284c7] font-semibold">${post.category}</span>
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
    const posts = JSON.parse(safeLocalStorage('get', 'posts') || '[]');
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
    document.getElementById('postLink').value = post.link || '';
    showPostForm(true);
}

function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        const posts = JSON.parse(safeLocalStorage('get', 'posts') || '[]');
        const updatedPosts = posts.filter(p => p.id !== postId);
        savePosts(updatedPosts);
    }
}

postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const posts = JSON.parse(safeLocalStorage('get', 'posts') || '[]');
    const newPost = {
        id: editingPostId || Date.now(),
        title: document.getElementById('postTitle').value.trim(),
        category: document.getElementById('postCategory').value.trim(),
        description: document.getElementById('postDescription').value.trim(),
        link: document.getElementById('postLink').value.trim()
    };

    if (editingPostId) {
        const index = posts.findIndex(p => p.id === editingPostId);
        if (index !== -1) {
            posts[index] = newPost;
        }
    } else {
        posts.push(newPost);
    }

    savePosts(posts);
    showPostForm(false);
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
checkLoginStatus(); 