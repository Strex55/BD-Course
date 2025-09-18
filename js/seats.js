document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("sessionId");
    const movieTitle = params.get("movieTitle") ? decodeURIComponent(params.get("movieTitle")) : "Фильм";
    const time = params.get("time") ? decodeURIComponent(params.get("time")) : "";
    const hall = params.get("hall") ? decodeURIComponent(params.get("hall")) : "";
    const poster = params.get("poster") ? decodeURIComponent(params.get("poster")) : "../images/movie1.jpg";

    const sessionTitleEl = document.getElementById("session-title");
    const seatsContainer = document.getElementById("seats-container");
    const confirmBtn = document.getElementById("confirm-booking");

    sessionTitleEl.textContent = `${movieTitle} — ${time} (${hall})`;

    const ROWS = 6;
    const COLUMNS = 9;
    let selectedSeats = [];

    try {
        let seats = await getSeats(sessionId);
        seats = seats.filter(s => s.row <= ROWS && s.number <= COLUMNS);
        renderSeatsGrid(seats);
    } catch (err) {
        console.error("Ошибка загрузки мест:", err);
        seatsContainer.innerHTML = "<p>Не удалось загрузить места.</p>";
    }

    function renderSeatsGrid(seats) {
        seatsContainer.innerHTML = "";
        for (let row = 1; row <= ROWS; row++) {
            for (let number = 1; number <= COLUMNS; number++) {
                const seatObj = seats.find(s => s.row === row && s.number === number);
                const seatEl = document.createElement("div");
                seatEl.className = "seat";
                seatEl.dataset.row = row;
                seatEl.dataset.number = number;
                seatEl.textContent = number;

                if (seatObj && seatObj.taken) {
                    seatEl.classList.add("taken");
                } else {
                    seatEl.addEventListener("click", () => {
                        const idx = selectedSeats.findIndex(s => s.row === row && s.number === number);
                        if (idx >= 0) {
                            selectedSeats.splice(idx, 1);
                            seatEl.classList.remove("selected");
                        } else {
                            selectedSeats.push({ row, number });
                            seatEl.classList.add("selected");
                        }
                    });
                }
                seatsContainer.appendChild(seatEl);
            }
        }
    }

    confirmBtn.addEventListener("click", async () => {
        if (selectedSeats.length === 0) {
            alert("Выберите хотя бы одно место для брони.");
            return;
        }

        try {
            await addBooking(movieTitle, { id: sessionId, time, hall }, selectedSeats);
            alert("Бронирование успешно сохранено!");
            window.location.href = "bookings.html";
        } catch (err) {
            alert("Ошибка при бронировании: " + (err.message || err));
            console.error(err);
        }
    });
});
