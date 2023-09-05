const movieSearchInput = document.getElementById('movie-search-input')
const searchBtn = document.getElementById('search-btn')
const movieDisplay = document.getElementById('movie-display')
const addedMovieList = document.getElementById('movie-list')

const myKey = '43e8a442'

// Arrays to store movie data and watchlist
let movieArray = []
let watchListArr = []
let currentWatchList = []


if (localStorage.getItem('movies')){
    watchListArr = JSON.parse(localStorage.getItem('movies'))
}

// Function to fetch movie data based on search input
function fetchSearchData() {
    if (movieSearchInput.value) {
        fetch(`https://www.omdbapi.com/?apikey=${myKey}&s=${movieSearchInput.value}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.Search) {
                    moviesToArray(data.Search)
                } else {
                    alert('Film not found!')
                }
            })
    } else {
        movieSearchInput.focus()
    }
}

// Function to fetch movie details and populate movieArray
function moviesToArray(movieInfo) {
    const promises = movieInfo.map((list) => {
        return fetch(`https://www.omdbapi.com/?apikey=${myKey}&t=${list.Title}`)
            .then((res) => res.json())
    })

    Promise.all(promises)
        .then((data) => {
            movieArray = data
            renderMovieList()
        })
}

// Function to render the movie list in the DOM
function renderMovieList() {
    const movieHtml = movieArray.map((movie) => {
            const { Title, Poster, Runtime, Genre, imdbRating, imdbID, Plot } = movie
            return `
                <div class="movie-list">
                     <div id="movie-list-img">
                         <img id="movie-img" src="${Poster}" alt="Poster of ${Title}">
                     </div>
                   <div id="movie-details">
                         <div id="movie-name">
                             <h3 id="movie-title">${Title}</h3>
                             <i id="star-rating" class="fa-solid fa-star"></i>
                             <p id="movie-rate">${imdbRating}</p>
                         </div>
                         <div id="other-details">
                             <p id="movie-watch-hours">${Runtime}</p>
                             <p id="movie-genre">${Genre}</p>
                             <p id="add-to-watchlist" data-imdb="${imdbID}"><i class="fa-solid fa-circle-plus"></i>&nbsp;Add to Watchlist</p>
                         </div>
                         <p id="movie-description">${Plot}</p>
                     </div>
                 </div>
            `
        }).join('')
    movieDisplay.innerHTML = movieHtml
}

// Function to add a movie to the watchlist
function addToWatchlist(imdbID) {
    if (localStorage.getItem('movies')) {
        currentWatchList = JSON.parse(localStorage.getItem('movies'))
    } else {
        currentWatchList = []
    }

    const currentArray = currentWatchList.filter((watchlist) => watchlist.imdbID === imdbID)

    if (currentArray.length === 0) {
        const movieFilter = movieArray.find((movie) => movie.imdbID === imdbID)
        if (movieFilter) {
            watchListArr.unshift({
                Title: movieFilter.Title,
                Poster: movieFilter.Poster,
                Runtime: movieFilter.Runtime,
                Genre: movieFilter.Genre,
                imdbRating: movieFilter.imdbRating,
                imdbID: movieFilter.imdbID,
                Plot: movieFilter.Plot
            })

            const watchList = JSON.stringify(watchListArr)
            localStorage.setItem('movies', watchList)
        }
    } else {
        alert('This film is already in your Watch List!')
    }
}

// Event listener for Enter key press in the search input
movieSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        fetchSearchData()
    }
})

// Event listener for clicking the search button
searchBtn.addEventListener('click', fetchSearchData)

// Event listener for clicking on movie items in the display
movieDisplay.addEventListener('click', (e) => {
    e.preventDefault()
    if (e.target.dataset.imdb) {
        addToWatchlist(e.target.dataset.imdb)
    }
})

// Initial fetch
fetchSearchData()
