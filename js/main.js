// Form submission handling
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    let currentPage = 1;
    const postsPerPage = 6;
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            try {
                // Here you would typically send this to your backend
                console.log('Subscription email:', email);
                
                // Clear the input and show success message
                emailInput.value = '';
                alert('Thanks for subscribing! We\'ll be in touch soon.');
                
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Sorry, there was an error. Please try again later.');
            }
        });
    });

    // Load and apply social media links
    function updateSocialLinks(socialLinks = null) {
        try {
            // If no links provided, try to load from localStorage
            if (!socialLinks) {
                const stored = localStorage.getItem('socialLinks');
                if (stored) {
                    socialLinks = JSON.parse(stored);
                }
            }

            if (socialLinks) {
                const socialIcons = {
                    twitter: document.querySelector('a i.fa-twitter'),
                    instagram: document.querySelector('a i.fa-instagram'),
                    youtube: document.querySelector('a i.fa-youtube')
                };

                // Update social media links
                Object.entries(socialIcons).forEach(([platform, icon]) => {
                    if (icon && socialLinks[platform]) {
                        const link = icon.parentElement;
                        link.href = socialLinks[platform];
                        link.setAttribute('target', '_blank');
                        link.setAttribute('rel', 'noopener noreferrer');
                    }
                });
            }
        } catch (error) {
            console.error('Error updating social links:', error);
        }
    }

    // Load and display posts
    function updatePosts(posts = null) {
        try {
            // If no posts provided, try to load from localStorage
            if (!posts) {
                const stored = localStorage.getItem('posts');
                if (stored) {
                    posts = JSON.parse(stored);
                } else {
                    posts = [];
                }
            }

            const postsContainer = document.querySelector('.grid');
            const loadMoreBtn = document.querySelector('#loadMoreBtn');
            
            if (postsContainer) {
                // Get existing placeholder posts
                const placeholderPosts = Array.from(postsContainer.children).map(post => ({
                    isPlaceholder: true,
                    category: post.querySelector('span').textContent,
                    title: post.querySelector('h3').textContent,
                    description: post.querySelector('p').textContent,
                    thumbnail: post.querySelector('img').src
                }));

                // Calculate how many placeholders to show
                const totalToShow = Math.max(6, posts.length);
                const start = 0;
                const end = currentPage * postsPerPage;
                const hasMorePosts = posts.length > end;
                
                // Update load more button visibility
                if (loadMoreBtn) {
                    loadMoreBtn.style.display = hasMorePosts ? 'block' : 'none';
                }

                // Combine real posts with placeholders if needed
                let displayPosts = posts.slice(start, end);
                if (displayPosts.length < 6) {
                    const neededPlaceholders = 6 - displayPosts.length;
                    displayPosts = [...displayPosts, ...placeholderPosts.slice(0, neededPlaceholders)];
                }

                // Display posts
                postsContainer.innerHTML = displayPosts.map(post => `
                    <div class="post-card border rounded-2xl p-6 shadow-sm bg-white">
                        <div class="aspect-w-16 aspect-h-9 mb-4">
                            <img src="${post.thumbnail || 'https://via.placeholder.com/400x225'}" alt="${post.title}" class="rounded-lg object-cover w-full h-48">
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-[#0284c7] font-semibold">${post.category}</span>
                            <span class="text-sm text-gray-500">${post.date || ''}</span>
                        </div>
                        <h3 class="text-xl font-bold my-2">${post.title}</h3>
                        <p class="mb-4">${post.description}</p>
                        <div class="hidden post-content">${post.content || ''}</div>
                        <button class="text-[#0d9488] font-semibold hover:underline">Read More</button>
                    </div>
                `).join('');

                // Reattach click handlers for modals
                attachModalHandlers();
            }
        } catch (error) {
            console.error('Error updating posts:', error);
        }
    }

    // Load More functionality
    const loadMoreBtn = document.querySelector('#loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            updatePosts();
        });
    }

    // Initial load of content
    updateSocialLinks();
    updatePosts();

    // Listen for updates from admin page
    window.addEventListener('socialLinksUpdated', (event) => {
        if (event.detail) {
            updateSocialLinks(event.detail);
        }
    });

    window.addEventListener('postsUpdated', (event) => {
        if (event.detail) {
            currentPage = 1; // Reset to first page when posts are updated
            updatePosts(event.detail);
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Post Modal Functionality
const modal = document.getElementById('postModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.querySelector('.close-modal');

// Close modal when clicking the close button or outside the modal
closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Function to attach modal handlers
function attachModalHandlers() {
    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            const category = card.querySelector('span').textContent;
            const description = card.querySelector('p').textContent;
            const image = card.querySelector('img').src;
            const content = card.querySelector('.post-content').innerHTML;
            const date = card.querySelector('.text-gray-500').textContent;

            // Populate modal content with full article
            const processedContent = content
                .replace(/\n\n/g, '</p><p>') // Convert double newlines to paragraphs
                .replace(/\n/g, '<br>') // Convert single newlines to line breaks
                .replace(/#{3}\s*(.*?)\s*$/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>') // h3 tags
                .replace(/#{2}\s*(.*?)\s*$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>') // h2 tags
                .replace(/#{1}\s*(.*?)\s*$/gm, '<h1 class="text-3xl font-bold mt-10 mb-5">$1</h1>'); // h1 tags

            modalContent.innerHTML = `
                <div class="mb-6">
                    <img src="${image}" alt="${title}" class="w-full rounded-lg mb-4">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-sm text-[#0284c7] font-semibold">${category}</span>
                        <span class="text-sm text-gray-500">${date}</span>
                    </div>
                    <h2 class="text-2xl font-bold mb-4">${title}</h2>
                    <div class="prose max-w-none">
                        <p class="text-gray-600 mb-6">${description}</p>
                        <div class="modal-article prose prose-lg max-w-none">
                            <p>${processedContent}</p>
                        </div>
                    </div>
                </div>
            `;

            // Show modal
            modal.style.display = 'block';
        });
    });
} 