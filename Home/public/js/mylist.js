/*
let intervals = []; function startCountdown(scheduleDateTime, countdownEl, confirmBtn, removeBtn, messageEl) { if (countdownEl.intervalId) { clearInterval(countdownEl.intervalId); } function updateCountdown() { const now = new Date(); const timeDiff = scheduleDateTime - now;        if (timeDiff <= 0) {
    clearInterval(countdownEl.intervalId);
    countdownEl.innerHTML = "";
    messageEl.innerHTML = `<span>😊</span> Good News!! We Have Confirmed Your Schedule. Take A Chill Pill.`;
    if (confirmBtn) confirmBtn.remove();
    if (removeBtn) removeBtn.remove();
    return;
}

const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
const seconds = Math.floor((timeDiff / 1000) % 60);

countdownEl.innerHTML = `Countdown: ${hours}h ${minutes}m ${seconds}s`;

if (hours < 5) {
    messageEl.innerHTML = `<span>😊</span> Good News!! We Have Confirmed Your Schedule. Take A Chill Pill.`;
    if (confirmBtn) confirmBtn.remove();
    if (removeBtn) removeBtn.remove();
}
}

countdownEl.intervalId = setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call to set the first countdown value
}

function confirmSchedule(event) {
const index = event.target.dataset.index;
const dateInput = document.getElementById(`date-${index}`);
const timeInput = document.getElementById(`time-${index}`);
const ampmInput = document.getElementById(`ampm-${index}`);

if (dateInput.value && timeInput.value && ampmInput.value) {
const scheduledDate = dateInput.value;
const [hour, minute] = timeInput.value.split(":").map(Number);
const ampm = ampmInput.value;

const adjustedHour = ampm === "PM" && hour < 12 ? hour + 12 : ampm === "AM" && hour === 12 ? 0 : hour;

const scheduleDateTime = new Date(`${scheduledDate}T${adjustedHour}:${minute}:00`);

if (isNaN(scheduleDateTime.getTime())) {
    alert("Invalid date or time. Please recheck your inputs.");
    return;
}

const countdownEl = event.target.closest(".my-list-item").querySelector(".countdown") || document.createElement("div");
const messageEl = event.target.closest(".my-list-item").querySelector(".confirmation-message") || document.createElement("div");
countdownEl.classList.add("countdown");
messageEl.classList.add("confirmation-message");

const confirmBtn = event.target;
const removeBtn = confirmBtn.nextElementSibling;

confirmBtn.parentNode.appendChild(countdownEl);
confirmBtn.parentNode.appendChild(messageEl);

startCountdown(scheduleDateTime, countdownEl, confirmBtn, removeBtn, messageEl);
} else {
alert("Please select a date, time, and AM/PM.");
}
}

document.addEventListener("DOMContentLoaded", loadMyList);
*/