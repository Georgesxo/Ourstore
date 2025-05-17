document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');
    const heroSection = document.getElementById('heroSection');
    console.log("searchInput:", searchInput);
    console.log("heroSection:", heroSection);

    if (!searchInput || !heroSection) {
        console.error('Search input or hero section not found!');
        return;
    }

    searchInput.addEventListener('input', function () {
        const searchQuery = this.value.trim().toLowerCase();
        const productItems = document.querySelectorAll('.product-item');
        let anyVisible = false;
        productItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchQuery)) {
                item.style.display = 'flex';
                anyVisible = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Hide/show the entire hero section
        if (searchQuery.length > 0 && anyVisible) {
            heroSection.style.display = 'none';
        } else {
            heroSection.style.display = '';
        }
    });
});