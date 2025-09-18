// sessions.js
document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("movieId");
    const movieTitle = params.get("title") ? decodeURIComponent(params.get("title")) : "Фильм";
    const poster = params.get("poster") ? decodeURIComponent(params.get("poster")) : "../images/movie1.jpg";

    const titleEl = document.getElementById("movie-title");
    const sessionsList = document.getElementById("sessions-list");
    const posterImg = document.getElementById("movie-poster");
    const posterInfo = document.getElementById("poster-info");

    titleEl.textContent = `Сеансы — ${movieTitle}`;
    posterImg.src = poster;
    posterImg.alt = movieTitle;
    posterInfo.innerHTML = `<strong>${movieTitle}</strong>`;

    try {
        const sessions = await getSessions(movieId);
        if (!sessions || sessions.length === 0) {
            sessionsList.innerHTML = "<p>Сеансов не найдено.</p>";
            return;
        }

        sessionsList.innerHTML = "";
        sessions.forEach(s => {
            const card = document.createElement("div");
            card.className = "session-card";

            const timeEl = document.createElement("div");
            timeEl.className = "session-time";
            timeEl.textContent = s.time;

            const hallEl = document.createElement("div");
            hallEl.className = "session-hall";
            hallEl.textContent = s.hall;

            // кнопка перейти к выбору мест (передаём poster и title)
            const chooseLink = document.createElement("a");
            chooseLink.className = "choose-btn";
            chooseLink.href = `seats.html?sessionId=${encodeURIComponent(s.id)}&movieTitle=${encodeURIComponent(movieTitle)}&time=${encodeURIComponent(s.time)}&hall=${encodeURIComponent(s.hall)}&poster=${encodeURIComponent(poster)}`;
            chooseLink.textContent = "Выбрать места";

            card.appendChild(timeEl);
            card.appendChild(hallEl);
            card.appendChild(chooseLink);

            sessionsList.appendChild(card);
        });

    } catch (err) {
        console.error("Ошибка загрузки сеансов:", err);
        sessionsList.innerHTML = "<p>Ошибка загрузки сеансов.</p>";
    }
});
