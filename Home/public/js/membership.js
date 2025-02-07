document.addEventListener('DOMContentLoaded', function() {
    const membershipStatus = localStorage.getItem('membershipStatus');
    const membershipExpiry = localStorage.getItem('membershipExpiry');
    const filterContainer = document.querySelector('.filter-container');

    if (membershipStatus === 'premium' && membershipExpiry) {
        const expiryTime = new Date(membershipExpiry).getTime();
        const currentTime = new Date().getTime();
        
        if (currentTime < expiryTime) {
            filterContainer.style.display = 'block';
        } else {
            localStorage.setItem('membershipStatus', 'free');
            localStorage.removeItem('membershipExpiry');
            filterContainer.style.display = 'none';
        }
    } else {
        filterContainer.style.display = 'none';
    }
});
