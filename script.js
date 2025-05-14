document.addEventListener('DOMContentLoaded', () => {
    const artCards = document.querySelectorAll('.art-card');
    const dotsContainer = document.querySelector('.carousel-dots');
    const galleryCarousel = document.querySelector('.gallery-carousel');
    const detailPanel = document.querySelector('.detail-panel');
    const closeDetailBtn = document.querySelector('.close-detail');
    let currentIndex = Math.floor(artCards.length / 2);
    let isAnimating = false;

    artCards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => navigateTo(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');
    updateCardsAndDots();

    function navigateTo(index) {
        if (isAnimating) return;
        
        const newIndex = (index + artCards.length) % artCards.length;
        if (newIndex === currentIndex) return;
        
        isAnimating = true;
        currentIndex = newIndex;
        galleryCarousel.classList.add('transitioning');
        updateCardsAndDots();
        
        setTimeout(() => {
            galleryCarousel.classList.remove('transitioning');
            isAnimating = false;
        }, 800);
    }

    function updateCardsAndDots() {
        artCards.forEach((card, index) => {
            card.classList.remove('current-art');
            card.style.transform = '';
            card.style.opacity = '0.6';
            card.style.zIndex = '1';

            const offset = index - currentIndex;
            const absOffset = Math.abs(offset);

            if (index === currentIndex) {
                card.classList.add('current-art');
                card.style.transform = 'translateZ(150px) rotateY(0deg) scale(1.08)';
                card.style.opacity = '1';
                card.style.zIndex = '10';
                updateArtistInfo(card);
            } else if (absOffset <= 3) {
                const direction = offset < 0 ? -1 : 1;
                const translateX = direction * (200 + (absOffset * 80));
                const translateZ = -50 * absOffset;
                const rotateY = direction * (20 + (absOffset * 4));
                const scaleValue = Math.max(1 - absOffset * 0.05, 0.8);
                const opacityValue = Math.max(1 - (absOffset * 0.15), 0.5);
                
                card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scaleValue})`;
                card.style.opacity = opacityValue;
                card.style.zIndex = 5 - absOffset;
            } else {
                const direction = offset < 0 ? -1 : 1;
                card.style.transform = `translateX(${direction * 600}px) translateZ(-500px) rotateY(${direction * 60}deg) scale(0.4)`;
                card.style.opacity = '0';
                card.style.zIndex = '0';
            }
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function updateArtistInfo(card) {
        const artistPortraitImg = document.querySelector('.artist-portrait');
        const artistNameEl = document.querySelector('.artist-name');
        const artistDobEl = document.querySelector('.artist-dob');
        const artistOriginEl = document.querySelector('.artist-origin');
        
        artistPortraitImg.src = card.dataset.artistPortrait || '';
        artistPortraitImg.alt = card.dataset.artist || 'Artist Portrait';
        artistNameEl.textContent = card.dataset.artist || 'N/A';
        artistDobEl.textContent = card.dataset.artistDob || 'N/A';
        artistOriginEl.textContent = card.dataset.artistOrigin || 'N/A';
    }

    function showDetailPanel(card) {
        const detailImage = detailPanel.querySelector('.detail-image');
        const detailTitle = detailPanel.querySelector('.detail-title');
        const detailArtist = detailPanel.querySelector('.detail-artist');
        const detailDate = detailPanel.querySelector('.detail-date');
        const detailMedium = detailPanel.querySelector('.detail-medium');
        const detailDimensions = detailPanel.querySelector('.detail-dimensions');
        const detailDescription = detailPanel.querySelector('.detail-description');
        
        const image = card.querySelector('.art-image-container img');
        const title = card.querySelector('.art-info h2');
        const date = card.querySelector('.art-info .date');
        const quote = card.querySelector('.art-info .quote');
        const details = card.querySelectorAll('.artwork-details .details');
        
        detailImage.src = image.src;
        detailImage.alt = image.alt;
        detailTitle.textContent = title.textContent;
        detailArtist.textContent = `Artist: ${card.dataset.artist}`;
        detailDate.textContent = `Date: ${date.textContent}`;
        detailMedium.textContent = details[0].textContent;
        detailDimensions.textContent = details[1].textContent;
        detailDescription.innerHTML = `<p>${quote.textContent}</p>
            <p>This piece by ${card.dataset.artist} (${card.dataset.artistDob}) showcases the artist's distinctive style. 
            ${card.dataset.artist} was born in ${card.dataset.artistOrigin} and created numerous influential works.</p>`;
        
        detailPanel.classList.add('active');
    }

    function closeDetailPanel() {
        detailPanel.classList.remove('active');
    }

    closeDetailBtn.addEventListener('click', closeDetailPanel);
    detailPanel.addEventListener('click', (e) => {
        if (e.target === detailPanel) {
            closeDetailPanel();
        }
    });

    artCards.forEach(card => {
        const expandButton = card.querySelector('.expand-button');
        expandButton.addEventListener('click', (e) => {
            e.stopPropagation();
            showDetailPanel(card);
        });
    });

    document.querySelector('.prev-artist').addEventListener('click', () => navigateTo(currentIndex - 1));
    document.querySelector('.next-artist').addEventListener('click', () => navigateTo(currentIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') navigateTo(currentIndex - 1);
        if (e.key === 'ArrowRight') navigateTo(currentIndex + 1);
        if (e.key === 'Escape') closeDetailPanel();
    });

    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) navigateTo(currentIndex + 1);
        if (touchEndX > touchStartX + 50) navigateTo(currentIndex - 1);
    }

    const navButtons = document.querySelectorAll('.y2k-button');
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const sectionId = button.id.replace('nav-', '') + '-section';
            document.querySelectorAll('.content-section').forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(sectionId).style.display = 'block';
            
            if (sectionId === 'home-section') {
                document.querySelector('.artist-info-bar').style.display = 'flex';
                document.querySelector('.carousel-dots').style.display = 'flex';
                document.querySelector('.action-buttons').style.display = 'flex';
                updateCardsAndDots();
            } else {
                document.querySelector('.artist-info-bar').style.display = 'none';
                document.querySelector('.carousel-dots').style.display = 'none';
                document.querySelector('.action-buttons').style.display = 'none';
            }
        });
    });

    updateArtistInfo(artCards[currentIndex]);
});