// SalamChat Web MVP - app.js

let posts = [];

// Sample posts
function initializeSamplePosts() {
    posts = [
        {
            id: Date.now() - 100000,
            author: "SalamChat",
            handle: "@schat",
            time: "1h",
            content: "Welcome to SalamChat! The lightweight African social platform. 🚀 What are you building today?",
            likes: 42
        },
        {
            id: Date.now() - 200000,
            author: "Tech Africa",
            handle: "@techafrica",
            time: "3h",
            content: "The future of social media is here. Building with pure HTML, CSS & JS for speed and simplicity.",
            likes: 18
        }
    ];
    renderPosts();
}

// Render all posts
function renderPosts() {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';

    const sortedPosts = [...posts].sort((a, b) => b.id - a.id);

    sortedPosts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.className = 'post';
        postEl.innerHTML = `
            <img src="https://via.placeholder.com/48" alt="Avatar" class="avatar">
            <div class="post-content">
                <div class="post-header">
                    <span class="post-author">${post.author}</span>
                    <span class="post-handle">${post.handle}</span>
                    <span class="post-time">· ${post.time}</span>
                </div>
                <div class="post-text">${post.content}</div>
                <div class="post-actions">
                    <button class="action-btn like-btn" data-id="${post.id}">
                        ❤️ <span class="like-count">${post.likes}</span>
                    </button>
                </div>
            </div>
        `;
        feed.appendChild(postEl);
    });

    attachLikeListeners();
}

// Like button listeners
function attachLikeListeners() {
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = parseInt(this.getAttribute('data-id'));
            likePost(postId);
        });
    });
}

// Create new post
function createPost() {
    const input = document.getElementById('post-input');
    const content = input.value.trim();

    if (!content) {
        alert("Post cannot be empty!");
        return;
    }

    if (content.length > 280) {
        alert("Post is too long! Max 280 characters.");
        return;
    }

    const newPost = {
        id: Date.now(),
        author: "You",
        handle: "@you",
        time: "now",
        content: content,
        likes: 0
    };

    posts.unshift(newPost);
    input.value = '';
    updateCharCount();

    renderPosts();
    saveToLocalStorage();
}

// Like a post
function likePost(id) {
    const post = posts.find(p => p.id === id);
    if (post) {
        post.likes++;
        renderPosts();
        saveToLocalStorage();
    }
}

// Character counter
function updateCharCount() {
    const input = document.getElementById('post-input');
    const countEl = document.getElementById('char-count');
    const remaining = 280 - input.value.length;
    countEl.textContent = remaining;

    const submitBtn = document.getElementById('post-submit');
    submitBtn.disabled = remaining < 0 || input.value.trim() === '';
}

// LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('schat_posts', JSON.stringify(posts));
}

function loadFromLocalStorage() {
    const savedPosts = localStorage.getItem('schat_posts');
    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    }
}

// Event listeners
function setupEventListeners() {
    const postSubmit = document.getElementById('post-submit');
    const postInput = document.getElementById('post-input');
    const postBtnSidebar = document.getElementById('post-btn');

    postSubmit.addEventListener('click', createPost);

    postInput.addEventListener('input', updateCharCount);

    // Ctrl/Cmd + Enter to post
    postInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            createPost();
        }
    });

    postBtnSidebar.addEventListener('click', () => {
        postInput.focus();
    });
}

// Initialize
function init() {
    loadFromLocalStorage();
    if (posts.length === 0) {
        initializeSamplePosts();
    } else {
        renderPosts();
    }
    setupEventListeners();
    updateCharCount();
}

document.addEventListener('DOMContentLoaded', init);
