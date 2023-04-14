function searchSong(){
  //let songLyrics = $("idname").value;
  //let songArtist = $("idname").value;
  $.ajax({
    type: "GET",
    data: {
        apikey:"8aeb7ff0f51f21a364a803d7a9db035f",
        q_lyrics: "thought i ran into you", //switch to songLyrics variable,
        q_artist: "green day", //switch to songArtist variable,
        //f_music_genre_id: "20",
        format:"jsonp",
        callback:"jsonp_callback"
    },
    url: "http://api.musixmatch.com/ws/1.1/track.search?page_size=10&page=1&s_track_rating=desc",
    dataType: "jsonp",
    jsonpCallback: 'jsonp_callback',
    contentType: 'application/json',
    success: function(data) {
        console.log(data); 
        console.log(data.message.body.track_list[0].track.track_name);
    },
    error: function(jqXHR, textStatus, errorThrown) {
       console.log(jqXHR);
       console.log(textStatus);
       console.log(errorThrown);
    }    
  });
 };
 //searchSong();



function querySpotify(searchParams) {
  // Used to get access token from Spotify API.
  var clientId = "d1f4e5778128411caa0f75e77acc0c35";
  var clientSecret = "a783b8a0bedb4bd58196734b1b619e47";
  var basicAuth = btoa(`${clientId}:${clientSecret}`);
  var accessToken;

  // Get access token.
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: "grant_type=client_credentials",
  })
    .then((response) => response.json())
    .then((data) => {
      accessToken = data.access_token;

      // Authenticate request and get song from Spotify.
      fetch(`https://api.spotify.com/v1/search?q=${searchParams}&type=track`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
    });
}

// Example function call. -- Searching for a track and artist.
querySpotify("track:The%20Real%20Slim%20Shady%20artist:Eminem");

// Returns song information, preview, etc.

$(function (){

  var searchResultsEl = $('#search-results');
  var resultCardsEl = $('#results-card')







});
