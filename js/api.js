// api.js - тестовые данные + localStorage для броней

async function getMovies() {
    return [
        { id: 1, title: "Майнкрафт в кино", duration: 101, genre: "Приключения, комедия", age_rating: "12+", poster: "../images/minecraft.jpg" },
        { id: 2, title: "Пять ночей с Фредди", duration: 110, genre: "Ужасы, детектив", age_rating: "16+", poster: "../images/fnaf.jpg" },
        { id: 3, title: "Дандадан", duration: 93, genre: "Аниме", age_rating: "18+", poster: "../images/dandadan.jpg" },
        { id: 4, title: "Интерстеллар", duration: 169, genre: "Фантастика", age_rating: "14+", poster: "../images/interstellar.jpg" }
    ];
}

async function getSessions(movieId) {
    const sessions = {
        1: [
            { id: 101, time: "10:00", hall: "Зал 1" },
            { id: 102, time: "14:30", hall: "Зал 2" },
            { id: 103, time: "19:00", hall: "Зал 3" }
        ],
        2: [
            { id: 201, time: "12:00", hall: "Зал 1" },
            { id: 202, time: "19:00", hall: "Зал 3" }
        ],
        3: [
            { id: 301, time: "22:00", hall: "Зал 2" }
        ],
        4: [
            { id: 401, time: "16:00", hall: "Зал 1" },
            { id: 402, time: "20:00", hall: "Зал 3" }
        ]
    };
    return sessions[movieId] || [];
}

// localStorage для броней
function getBookingsFromStorage() {
    return JSON.parse(localStorage.getItem("bookings") || "[]");
}

function saveBookingsToStorage(bookings) {
    localStorage.setItem("bookings", JSON.stringify(bookings));
}

function cancelBooking(bookingId) {
    const bookings = getBookingsFromStorage();
    const newBookings = bookings.filter(b => b.id !== bookingId);
    saveBookingsToStorage(newBookings);
}

// places for a session — built from bookings (no random!)
async function getSeats(sessionId) {
    const seats = [];
    const bookings = getBookingsFromStorage();
    // Сформируем набор занятых пар "row-number" для данного сеанса
    const takenSet = new Set(
        bookings
            .filter(b => String(b.session.id) === String(sessionId))
            .flatMap(b => b.seats.map(s => `${s.row}-${s.number}`))
    );

    for (let row = 1; row <= 10; row++) {
        for (let number = 1; number <= 10; number++) {
            seats.push({
                id: `${sessionId}-${row}-${number}`,
                row,
                number,
                taken: takenSet.has(`${row}-${number}`)
            });
        }
    }
    return seats;
}

async function addBooking(movieTitle, session, selectedSeats) {
    const bookings = getBookingsFromStorage();

    // защита: не добавляем, если кто-то уже занял одно из выбранных мест
    const takenNow = bookings
        .filter(b => String(b.session.id) === String(session.id))
        .flatMap(b => b.seats.map(s => `${s.row}-${s.number}`));
    const conflict = selectedSeats.some(s => takenNow.includes(`${s.row}-${s.number}`));
    if (conflict) throw new Error("Одно или несколько мест уже заняты.");

    bookings.push({
        id: Date.now(),
        movieTitle,
        session,
        seats: selectedSeats
    });
    saveBookingsToStorage(bookings);
}

async function getBookings() {
    return getBookingsFromStorage();
}


