// bookings.js
document.addEventListener("DOMContentLoaded", async () => {
    const bookingsList = document.getElementById("bookings-list");

    try {
        const bookings = await getBookings();

        if (!bookings || bookings.length === 0) {
            bookingsList.innerHTML = "<p>У вас пока нет броней.</p>";
            return;
        }

        bookingsList.innerHTML = "";

        bookings.forEach(booking => {
            const li = document.createElement("li");
            li.className = "booking-item";

            const seatsStr = booking.seats.map(s => `Ряд ${s.row}, место ${s.number}`).join("; ");

            li.innerHTML = `
                <h4>${escapeHtml(booking.movieTitle)}</h4>
                <p><strong>Сеанс:</strong> ${escapeHtml(booking.session.time)}, ${escapeHtml(booking.session.hall)}</p>
                <p><strong>Места:</strong> ${escapeHtml(seatsStr)}</p>
                <button class="cancel-btn">Отменить</button>
            `;

            const cancelBtn = li.querySelector(".cancel-btn");
            cancelBtn.addEventListener("click", () => {
                if (confirm("Вы уверены, что хотите отменить эту бронь?")) {
                    cancelBooking(booking.id);
                    li.remove();
                }
            });

            bookingsList.appendChild(li);
        });

    } catch (err) {
        console.error("Ошибка загрузки броней:", err);
        bookingsList.innerHTML = "<p>Ошибка загрузки броней.</p>";
    }
});

// удаляет бронь по id
function cancelBooking(bookingId) {
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const newBookings = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem("bookings", JSON.stringify(newBookings));
}

// функция для безопасного вывода текста в HTML
function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (m) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
    });
}
