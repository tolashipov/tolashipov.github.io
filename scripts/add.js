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
                        constructAddPage(movie);
                        break;
                    }
                }
            }
        });
    });
}

function constructAddPage(data) {
    document.title = "add " + data.name;
    loadingAnimation.remove();
    var container = document.getElementById('main-container');
    container.innerHTML = "<p>Scan the QR code below to add the movie to the DataBase</p><img id='qrcode' src='style/images/qrcode.png'>";
}

init();