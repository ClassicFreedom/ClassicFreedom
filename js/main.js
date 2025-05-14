// Form submission handling
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
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
                }
            }

            const postsContainer = document.querySelector('.grid');
            if (postsContainer && posts && posts.length > 0) {
                postsContainer.innerHTML = posts.map(post => `
                    <div class="border rounded-2xl p-6 shadow-sm">
                        <span class="text-sm text-[#0284c7] font-semibold">${post.category}</span>
                        <h3 class="text-xl font-bold my-2">${post.title}</h3>
                        <p class="mb-4">${post.description}</p>
                        ${post.link ? `<a href="${post.link}" target="_blank" rel="noopener noreferrer" class="text-[#0d9488] font-semibold hover:underline">Read More</a>` : ''}
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error updating posts:', error);
        }
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