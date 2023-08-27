const apiKey = '6b6ccfce';
const searchInput = document.getElementById("userInput");
const suggestionContainer = document.getElementById("suggestionList");
const searchButton = document.getElementById("searchBtn");

async function searchMovies(query) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=6b6ccfce&s=${query}`)
    const data = await response.json();
    return data.Search || [];
}

searchInput.addEventListener("input", () => {
    const movieName = searchInput.value.trim();
    if(movieName.length > 0){
        getSuggestions(movieName);
    }
    else{
        clearSuggestions();
    }
} );

function getSuggestions(text) {
    const apiUrl = `http://www.omdbapi.com/?apikey=6b6ccfce&s=${text}`;

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

function clearSuggestions() {
    suggestionContainer.innerHTML = "";
}

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
                <button class="btn btn-primary btn-sm favourite-button" data-imdbid="${movie.imdbID}">Add to Favourites</button>
                <a href="movie.html?id=${movie.imdbID}" class="btn btn-secondary btn-sm more-button">More</a>
            `
            moviesContainer.appendChild(movieCard);
    });
}

searchButton.addEventListener("click", function () {
    const movieName = searchInput.value.trim();
    console.log(movieName);
    if(movieName.length > 0){
        searchMovies(movieName)
        .then(results => {
            displayMovies(results);
            localStorage.setItem('searchResults', JSON.stringify(results));
        })
        .catch(err => console.error('Error searching movies:', err));
    }
})