document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");

    function showLoader() {
        loader.classList.add("visible");
    }

    function hideLoader() {
        setTimeout(() => {
            loader.classList.remove("visible");
        }, 2000); // Delay to simulate slow loading
    }

    // Show loader during navigation
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href && href !== "#") {
                e.preventDefault();
                showLoader();

                // Delay navigation slightly longer than the loader
                setTimeout(() => {
                    window.location.href = href;
                }, 2500);
            }
        });
    });

    // Hide loader on page load
    hideLoader();
});
