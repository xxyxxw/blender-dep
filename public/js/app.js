
import { _supabase } from './supabase.js';

const gallery = document.getElementById('gallery');

// Date Formatter
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
};

// Create HTML Element for Work Item
const createWorkCard = (work, observer) => {
    const card = document.createElement('article');
    card.className = 'work-card';

    // Image (Lazy Loaded)
    const imgContainer = document.createElement('div');
    imgContainer.className = 'work-image-container';

    const img = document.createElement('img');
    img.dataset.src = work.image_url; // Set data-src for Lazy Loading
    img.alt = work.title;
    img.className = 'work-image';
    // img.loading = 'lazy'; // We are using IntersectionObserver, so native lazy is optional but good fallback if JS fails (but we rely on JS for src swap here)

    // Observer for fade-in effect
    img.onload = () => img.classList.add('loaded');

    // Removed immediate src assignment
    // img.src = work.image_url; 

    if (observer) {
        observer.observe(img);
    } else {
        // Fallback if observer not passed (should not happen in this flow)
        img.src = work.image_url;
    }

    imgContainer.appendChild(img);

    // Info
    const info = document.createElement('div');
    info.className = 'work-info';

    const title = document.createElement('h2');
    title.className = 'work-title';
    title.textContent = work.title;

    const date = document.createElement('span');
    date.className = 'work-date';
    date.textContent = formatDate(work.date);

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'work-tags';
    if (work.tags && Array.isArray(work.tags)) {
        work.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.textContent = tag;
            tagsDiv.appendChild(tagSpan);
        });
    }

    info.appendChild(title);
    info.appendChild(date);
    info.appendChild(tagsDiv);

    card.appendChild(imgContainer);
    card.appendChild(info);

    return card;
};

// Fetch Works from Supabase
const fetchWorks = async () => {
    try {
        const { data, error } = await _supabase
            .from('works')
            .select('*')
            .eq('is_visible', true)
            .order('date', { ascending: false });

        if (error) throw error;

        // Clear Loading state
        gallery.innerHTML = '';

        if (!data || data.length === 0) {
            gallery.innerHTML = '<div class="no-works">No works found.</div>';
            return;
        }

        // Initialize Intersection Observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // Load slightly before they come into view
            threshold: 0.01
        });

        data.forEach(work => {
            const card = createWorkCard(work, imageObserver);
            gallery.appendChild(card);
        });

    } catch (err) {
        console.error('Error fetching works:', err);
        gallery.innerHTML = '<div class="error">Failed to load works. Check console for details.</div>';
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchWorks();
    initLightbox();
});

// Lightbox Logic
const initLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    if (!lightbox || !lightboxImg) return;

    // Delegate click event for dynamically added images
    gallery.addEventListener('click', (e) => {
        // Build the path up from the target to find the work-card or verify click area
        // We want to trigger when the image or card is clicked.
        // Let's target the card or image wrapper specifically.
        const card = e.target.closest('.work-card');
        if (card) {
            const img = card.querySelector('.work-image');
            if (img && img.src) {
                // Determine high-res URL if available, otherwise use current src
                // In this simple version, we stick to what we have or could use original url from dataset if we stored it
                lightbox.style.display = 'flex';
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            }
        }
    });

    // Close on button click
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
        setTimeout(() => { lightbox.style.display = 'none'; }, 300); // Wait for transition if any, currently simple display toggle
    });

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            setTimeout(() => { lightbox.style.display = 'none'; }, 300);
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            setTimeout(() => { lightbox.style.display = 'none'; }, 300);
        }
    });
};
