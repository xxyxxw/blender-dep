
import { _supabase } from './supabase.js';

const gallery = document.getElementById('gallery');

// --- Helper: image_urls 配列を安全に取得 (image_url フォールバック付き) ---
const getImageUrls = (work) => {
    if (work.image_urls && Array.isArray(work.image_urls) && work.image_urls.length > 0) {
        return work.image_urls;
    }
    if (work.image_url) {
        return [work.image_url];
    }
    return [];
};

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

    const imageUrls = getImageUrls(work);
    // カードにimage_urls情報を保持
    card.dataset.imageUrls = JSON.stringify(imageUrls);

    // Image (Lazy Loaded) — サムネイルは1枚目を使用
    const imgContainer = document.createElement('div');
    imgContainer.className = 'work-image-container';

    const thumbnailUrl = imageUrls.length > 0 ? imageUrls[0] : '';

    const img = document.createElement('img');
    img.dataset.src = thumbnailUrl;
    img.alt = work.title;
    img.className = 'work-image';

    img.onload = () => img.classList.add('loaded');

    if (observer && thumbnailUrl) {
        observer.observe(img);
    } else if (thumbnailUrl) {
        img.src = thumbnailUrl;
    }

    imgContainer.appendChild(img);

    // 複数枚バッジ
    if (imageUrls.length > 1) {
        const badge = document.createElement('span');
        badge.className = 'image-count-badge';
        badge.textContent = imageUrls.length;
        imgContainer.appendChild(badge);
    }

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
            rootMargin: '50px 0px',
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

// --- Lightbox Logic (複数画像ナビゲーション対応) ---
const initLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const counter = document.getElementById('lightbox-counter');

    if (!lightbox || !lightboxImg) return;

    let currentImages = [];
    let currentIndex = 0;

    // ライトボックスに画像をセット
    const showImage = (index) => {
        if (currentImages.length === 0) return;
        currentIndex = index;
        lightboxImg.src = currentImages[currentIndex];

        // カウンタ表示
        if (counter) {
            if (currentImages.length > 1) {
                counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
                counter.style.display = 'block';
            } else {
                counter.style.display = 'none';
            }
        }

        // ナビボタン表示制御
        if (prevBtn) prevBtn.style.display = currentImages.length > 1 ? 'flex' : 'none';
        if (nextBtn) nextBtn.style.display = currentImages.length > 1 ? 'flex' : 'none';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => { lightbox.style.display = 'none'; }, 300);
    };

    // カードクリック → ライトボックスを開く
    gallery.addEventListener('click', (e) => {
        const card = e.target.closest('.work-card');
        if (!card) return;

        try {
            currentImages = JSON.parse(card.dataset.imageUrls || '[]');
        } catch (_) {
            currentImages = [];
        }
        if (currentImages.length === 0) return;

        lightbox.style.display = 'flex';
        showImage(0);
        lightbox.classList.add('active');
    });

    // 前へ
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage((currentIndex - 1 + currentImages.length) % currentImages.length);
        });
    }

    // 次へ
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage((currentIndex + 1) % currentImages.length);
        });
    }

    // 閉じる
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    // 背景クリックで閉じる
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // キーボード操作
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && currentImages.length > 1) {
            showImage((currentIndex - 1 + currentImages.length) % currentImages.length);
        }
        if (e.key === 'ArrowRight' && currentImages.length > 1) {
            showImage((currentIndex + 1) % currentImages.length);
        }
    });
};
