// Check membership status and show/hide filter
document.addEventListener('DOMContentLoaded', () => {
    const membershipStatus = localStorage.getItem('membershipStatus');
    const filterContainer = document.getElementById('filter-container');

    if (membershipStatus === 'premium') {
        filterContainer.style.display = 'block';
    }

    // Handle filter selection
    const filterSelect = document.getElementById('filter-select');
    filterSelect.addEventListener('change', () => {
        const selectedValue = filterSelect.value;
        if (selectedValue) {
            window.location.href = selectedValue;
        }
    });
});
