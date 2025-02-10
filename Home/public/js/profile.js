document.addEventListener("DOMContentLoaded", () => {
    const profileCircle = document.getElementById("profileCircle");

    // Example user name (replace with actual user data)
    const userName = "John Doe";

    // Set the initial in the profile circle
    const userInitial = userName.charAt(0).toUpperCase();
    profileCircle.textContent = userInitial;

    // Navigate to profile page when clicked
    profileCircle.addEventListener("click", () => {
        window.location.href = "/profile";
    });
});
