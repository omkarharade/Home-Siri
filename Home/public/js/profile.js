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


async function isPremium() {

    try {
        const userId = await JSON.parse(
            document.getElementById("user-id").getAttribute("data-userId")
        );

        const params = new URLSearchParams({
            user_id: userId,
        });

        const url = `http://localhost:5000/api/auth/premium?${params}`;

        console.log("inside isPremium and userId = ", userId);

        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });


        const result = await response.json();

        if (response.ok) {
            console.log("user status is ", result.havePremium);
        } else {
            alert("Something went wrong: " + result.message);
        }

        return result.havePremium

    } catch (error) {
        alert("internal server error");
    }

}
async function isPremiumFunc() {

    return await isPremium();
}

