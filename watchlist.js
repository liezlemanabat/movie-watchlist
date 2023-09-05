const myWatchList = document.getElementById('my-watchlist')
let watchListFromLocal = []
getlocalValue()


function getlocalValue() {
    if (localStorage.getItem('movies')) {
        watchListFromLocal = JSON.parse(localStorage.getItem('movies'))
    } else {
        watchListFromLocal = []
    }
}

function renderWatchList() {
    let watchListHtml = watchListFromLocal.map((watchList) => {
        const { Title, Poster, Runtime, Genre, imdbRating, imdbID, Plot } = watchList
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
                             <p id="add-to-watchlist" data-imdb="${imdbID}"><i class="fa-solid fa-circle-minus"></i>&nbsp;Remove</p>
                         </div>
                         <p id="movie-description">${Plot}</p>
                     </div>
                 </div>
            `
    }).join('')
    
    const emptyWatchlist = `
                    <div class="action-container">
                        <h3>Your watchlist is looking a little empty...</h3>
                        <p onclick='window.location.href="index.html"'><i class="fa-solid fa-circle-plus"></i>Let's add some movies!</p>
                    </div>
                    `
    if (localStorage.getItem('movies')) {
        myWatchList.innerHTML = watchListHtml
    } else {
        myWatchList.innerHTML = emptyWatchlist
    } 
}
renderWatchList()

myWatchList.addEventListener('click', function(e){
    e.preventDefault()
    
    if (e.target.dataset.imdb) {
        let currentWatchList = JSON.parse(localStorage.getItem('movies'))
        let selectedMovieId = e.target.dataset.imdb
        let selectedMovieIndex = currentWatchList.findIndex((obj => obj.imdbID === selectedMovieId))
        
        currentWatchList.splice(selectedMovieIndex, 1)
        const newWatchList = JSON.stringify(currentWatchList)
        
        localStorage.clear()
        localStorage.setItem('movies', newWatchList)
        getlocalValue()
        renderWatchList()
    }
})

document.getElementById('search-link').addEventListener('click', navigateToIndex)

function navigateToIndex() {
    window.location.href = 'index.html'
}