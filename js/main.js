document.addEventListener("DOMContentLoaded", async () => {
    const moviesList = document.getElementById("movies-list");

    try {
        const movies = await getMovies();
        if (!movies || movies.length === 0) {
            moviesList.innerHTML = "<p>Фильмы не найдены.</p>";
            return;
        }

        movies.forEach(movie => {
            const a = document.createElement("a");
            a.className = "movie-card";
            a.href = `sessions.html?movieId=${encodeURIComponent(movie.id)}&title=${encodeURIComponent(movie.title)}&poster=${encodeURIComponent(movie.poster)}`;

            a.innerHTML = `
                <img src="${movie.poster}" alt="${escapeHtml(movie.title)}">
                <div class="movie-info">
                    <h3>${escapeHtml(movie.title)}</h3>
                    <div class="movie-meta">${movie.genre} • ${movie.duration} мин • ${movie.age_rating}</div>
                </div>
            `;

            moviesList.appendChild(a);
        });
    } catch (err) {
        console.error("Ошибка загрузки фильмов:", err);
        moviesList.innerHTML = "<p>Ошибка загрузки фильмов.</p>";
    }
});

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
}
