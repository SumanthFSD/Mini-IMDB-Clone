
async function getMovieInfo(imdbID){
    const response = await fetch(`http://www.omdbapi.com/?apikey=6b6ccfce&i=${imdbID}`);
    const data = await response.json();
    return data.Response === 'True' ? data : null;
}

function displayMovieDetails(movie) {
    const movieDetailsContainer = document.getElementById('movieDetails');
    movieDetailsContainer.innerHTML = `
        <div class="card mb-2">
            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <p>${movie.Plot}</p>
                <p><strong>Year:</strong> ${movie.Year}</p>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Runtime:</strong> ${movie.Runtime}</p>
                <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
                <!-- Add other movie details here -->
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get('id');
    // console.log(imdbID);

    if (imdbID) {
        getMovieInfo(imdbID)
            .then(movie => {
                if (movie) {
                    displayMovieDetails(movie);
                } else {
                    const movieDetailsContainer = document.getElementById('movieDetails');
                    movieDetailsContainer.innerHTML = '<p>Movie details not found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
                const movieDetailsContainer = document.getElementById('movieDetails');
                movieDetailsContainer.innerHTML = '<p>Error fetching movie details.</p>';
            });
    }
});
