// Check membership status and show/hide filter
document.addEventListener('DOMContentLoaded', () => {

    loadFilterIfPremium();

    const filterSelect = document.getElementById('filter-select');
    filterSelect.addEventListener('change', () => {
        const selectedValue = filterSelect.value;
        if (selectedValue) {
            window.location.href = selectedValue;
        }
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

async function loadFilterIfPremium(){

    const membershipStatus = await isPremium();
    console.log("membership status and inside filter == ", membershipStatus);
    const filterContainer = document.getElementById('filter-container');

    if (membershipStatus) {
        filterContainer.style.display = 'block';
    }

    // Handle filter selection
}