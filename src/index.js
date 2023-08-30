const apiKey = '6b6ccfce'; // OMDB API key
const searchInput = document.getElementById("userInput");
const suggestionContainer = document.getElementById("suggestionList");
const searchButton = document.getElementById("searchBtn");

// Search movies from OMDB and return them
async function searchMovies(query) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=6b6ccfce&s=${query}`)
    const data = await response.json();
    return data.Search || [];
}

// Clear all the search suggestions for the entered text
function clearSuggestions() {
    suggestionContainer.innerHTML = "";
}

// from OMDB search for movie names that has the entered text
function getSuggestions(text) {
    const apiUrl = `https://www.omdbapi.com/?apikey=6b6ccfce&s=${text}`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if(data.Search){
            const filteredMovies = data.Search.filter(movie => movie.Title.toLowerCase().startsWith(text.toLowerCase()));
            displaySuggestions(filteredMovies);
        }
        else{
            clearSuggestions();
        }
    }) 
    .catch(error => {
        console.log('Error: ', error);
    })
}

// If there is some text entered in the input area get suggestions for that
searchInput.addEventListener("input", () => {
    const movieName = searchInput.value.trim();
    if(movieName.length > 0){
        getSuggestions(movieName);
    }
    else{
        clearSuggestions();
    }
} );

// Show suggestions by creating option element and appending it to the suggestion data list
function displaySuggestions(movieList) {
    suggestionContainer.innerHTML = "";

    movieList.forEach(movie => {
        const suggestionItem = document.createElement("option");
        suggestionItem.classList.add("suggestion");
        suggestionItem.textContent = movie.Title;
        suggestionItem.style.color = "white";
        suggestionItem.addEventListener("click", () => {
            searchInput.value = movie.Title;
            clearSuggestions();
        });
        suggestionContainer.appendChild(suggestionItem);
    });
}

// Create a local storage for favourites and add the favourite movies to it
async function addToFavourites(event) {
    const imdbID = event.target.dataset.imdbid;
    const movie = await getMovieInfo(imdbID);
    // console.log(imdbID, movie);
    if(movie){
        const favouritesList = JSON.parse(localStorage.getItem('favourites')) || [];
        if(!favouritesList.some(m => m.imdbID === movie.imdbID)){
            favouritesList.push(movie);
            localStorage.setItem('favourites', JSON.stringify(favouritesList));
            alert(`${movie.Title} has been added to your favourites`);
        }
        else{
            alert(`You already have ${movie.Title} in your favourites list.`);
        }
    }
    else{
        alert("Sorry, Can't add!");
    }
}

// Get details for the selected movie and return the data
async function getMovieInfo(imdbID){
    const response = await fetch(`https://www.omdbapi.com/?apikey=6b6ccfce&i=${imdbID}`);
    const data = await response.json();
    return data.Response === 'True' ? data : null;
}

// Create a card for each movie and load it to the html page
function displayMovies(movies){
    const moviesContainer = document.getElementById("searchResults");
    moviesContainer.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("card");
        movieCard.innerHTML = `
            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <button id = "favBtn" class="btn btn-primary btn-sm favourite-button" data-imdbid="${movie.imdbID}">Add to Favourites</button>
                <a href="views/movie.html?id=${movie.imdbID}" class="btn btn-secondary btn-sm more-button">More</a>
            `
            moviesContainer.appendChild(movieCard);
    });
    const addToFavouritesBtn = document.querySelectorAll(".favourite-button");
    addToFavouritesBtn.forEach(button => {
        button.addEventListener('click', addToFavourites);
    });
}

// Display all movie that has the entered text in the movie name when the search button is clicked
searchButton.addEventListener("click", function () {
    const movieName = searchInput.value.trim();
    // console.log(movieName);
    if(movieName.length > 0){
        searchMovies(movieName)
        .then(results => {
            displayMovies(results);
            localStorage.setItem('searchResults', JSON.stringify(results));
        })
        .catch(err => console.error('Error searching movies:', err));
    }
});

// Populate the web page with the previous search results when the web page is restarted
const searchHistory = JSON.parse(localStorage.getItem('searchResults'));
if (searchHistory !== null && Object.keys(searchHistory).length > 0) {
    displayMovies(searchHistory);
}
