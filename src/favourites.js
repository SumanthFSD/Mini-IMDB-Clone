
function displayFavouriteMovies(){
    // console.log("Fav list");
    const favouritesListContainer = document.getElementById('favouritesList');
    favouritesListContainer.innerHTML = '';

    const favouritesList = JSON.parse(localStorage.getItem('favourites')) || [];

    if(favouritesList.length === 0){
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = "No favourite movies yet";
        favouritesListContainer.appendChild(emptyMessage);
    }
    else{
        favouritesList.forEach(movie => {
            const favMovieCard = document.createElement('div');
            favMovieCard.classList.add('card', 'col-md-4', 'mb-4');
            favMovieCard.innerHTML=`
            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <button class="btn btn-danger btn-sm remove-button" data-imdbid="${movie.imdbID}">Remove from Favourites</button>
                <a href="movie.html?id=${movie.imdbID}" class="btn btn-secondary btn-sm more-button">More</a>
            </div>
            `;
            favouritesListContainer.appendChild(favMovieCard);
        });
    }
    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeFromFavourites);
    });
}

function removeFromFavourites(event){
    const imdbID = event.target.dataset.imdbid;
    const favouritesList = JSON.parse(localStorage.getItem('favourites')) || [];

    const movieToRemove = favouritesList.find(movie => movie.imdbID === imdbID);
    if(movieToRemove) {
        alert(`${movieToRemove.Title} will be removed from your favourites!`);
        const updatedFavouritesList = favouritesList.filter(movie => movie.imdbID !== imdbID);
        localStorage.setItem('favourites', JSON.stringify(updatedFavouritesList));
        displayFavouriteMovies();
    }
    else{
        alert('Movie not found in favourites');
    }
}

if(window.location.pathname === '../views/favourites.html') {
    displayFavouriteMovies();
}

window.onload = displayFavouriteMovies;
