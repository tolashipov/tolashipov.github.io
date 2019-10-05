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
                var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
                    targetUrl = 'https://api.androidhive.info/json/movies.json';
                fetch(proxyUrl + targetUrl).then ((res)=> {
                    if (res.status === 400) {
                        document.getElementById('input-error').style.display='inline-block';
                        throw new Error('Error: something went wrong while connecting to the data');
                    }
                    return res.json();
                }).then(data=>{
                    for (movie of data){
                        server.movies.add( {
                            name: movie.title,
                            image: movie.image,
                            rating: movie.rating,
                            releaseYear: movie.releaseYear,
                            genres: movie.genre
                        } ).then( function ( item ) {
                            //console.log(item);
                        } );
                    }
                    loadingAnimation.remove();
                    server.movies.query('releaseYear')
                        .all()
                        .desc()
                        .execute()
                        .then(function (results) {
                            constructMainPage(results);
                        });
                }).catch(ex =>{
                    console.log(ex);
                });    
            } else {
                loadingAnimation.remove();
                server.movies.query('releaseYear')
                .all()
                .desc()
                .execute()
                .then(function (results) {
                    constructMainPage(results);
                });
            }
        });
    } );
    
}

function constructMainPage(movies) {
    var container = document.getElementById('main-container');
    var movieInfo = "";
    for (movie of movies) {
        movieInfo += `
        <div class="movie-tab">
            <p class="movie-title" onclick="loadMoviePage(${movie.id})">${movie.name}</p>
            <div class="plus" onclick="loadAddPage(${movie.id})"><div></div></div>
        </div>
        `;
    }
    container.innerHTML = movieInfo;
}

function loadMoviePage(id){
    sessionStorage.setItem('movie-id', id);
    document.location.href = 'moviePage.html';
}

function loadAddPage(id){
    server.movies.get(id)
    .then(function (results) {
        if(results == undefined){
            document.location.href = 'addPage.html';
        } else {
            snackBar();
        }
    });
}
function snackBar() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

init();