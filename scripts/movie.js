var loadingAnimation = document.getElementById('loading-animation');

var server;
function init(){
    db.open( {
        server: 'movie-list-app',
        version: 1,
        schema: {
            movies: {
                key: { keyPath: 'id' , autoIncrement: true },
                indexes: {
                    name: { },
                    image: { },
                    rating: { },
                    releaseYear: { },
                    genres: { }
                }
            }
        }
    } ).then( function ( s ) {
        server = s
        server.movies.query()
        .all()
        .execute()
        .then(function (results) {
            if(results.length == 0){
                console.log('empty');
            } else {
                var id = sessionStorage.getItem('movie-id');
                for (movie of results) {
                    if (movie.id == id) {
                        constructMoviePage(movie);
                        break;
                    }
                }
            }
        });
    });
}

function constructMoviePage (data) {
    loadingAnimation.remove();
    document.title = data.name;
    var container = document.getElementById('main-container');
    container.innerHTML = "";
        var movieInfo = `
        <div class="movie-page">
            <p class="movie-name">${data.name}</p>
            <img class="movie-img" src="${data.image}" alt="">
            <p class="movie-release">Rating: ${data.rating}</p>
            <p class="movie-rating">Realese Year: ${data.releaseYear}</p>
            <p class="movie-genres">Genres: ${data.genres}</p>
        </div>
        `;
    container.innerHTML = movieInfo;
}

init();