function searchSong(lyrics, artist){
  $.ajax({
    type: "GET",
    data: {
        apikey:"8aeb7ff0f51f21a364a803d7a9db035f",
        q_lyrics: lyrics,
        q_artist: artist,
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

        // Display top result on page
        let songTitle = $(".song-title"); 
        songTitle.text(data.message.body.track_list[0].track.track_name);
        songTitle.attr("type", "button");
        songTitle.click(querySpotify(data.message.body.track_list[0].track.track_name));

    },
    error: function(jqXHR, textStatus, errorThrown) {
       console.log(jqXHR);
       console.log(textStatus);
       console.log(errorThrown);
    }
  });
 };




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
        .then((data) => {
          var trackLink = data.tracks.items[0].external_urls.spotify;
          console.log(trackLink);
          // Add track link to search results
          var searchResultEl = $('<div class="search-result"></div>');
          var trackNameEl = $('<h2></h2>').text(data.tracks.items[0].name);
          var artistNameEl = $('<p></p>').text(data.tracks.items[0].artists[0].name);
          var trackLinkEl = $('<a></a>').text(trackLink).attr('href', trackLink).attr('target', '_blank');
          searchResultEl.append(trackNameEl, artistNameEl, trackLinkEl);
          $('#search-results').empty().append(searchResultEl);
          
        });
    });
}

// Example function call. -- Searching for a track and artist.
querySpotify("track:The%20Real%20Slim%20Shady%20artist:Eminem");

$(function (){
  $("#search-form").on("submit", function(e) {
    e.preventDefault();

    searchSong($("#search-lyrics").val(), $("#search-artist").val())
  })
});
var test = "test-button";

const searchHistory = $('#recent-searches');
const button = $('<button>').text(test);
searchHistory.append(button); 

//this is the function that will be called when the search button is clicked to store the search term in local storage and append it to the recent searches section



// function getRecentSearches() {
//   var recentSearch = localStorage.getItem("recentSearches");
//   if (recentSearch !== null) {
//     recentSearch = JSON.parse(recentSearch);
//   }
//   else {
// let recentSearchesContainer = document.getElementById('recent-searches');
// let recentSearchesHTML = getRecentSearches();
// recentSearchesContainer.innerHTML = recentSearchesHTML;

// Returns song information, preview, etc.

function modalPupUp(){

  var searchForm = $('#search-form');
  var searchArtist = $('#search-artist');
  var searchLyrics = $('#search-lyrics');
  
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission
  
    if (searchArtist.value.trim() === '' && searchLyrics.value.trim() === '') {
      // Show the modal if both search fields are empty
      var modal = $('#modal');
      modal.classList.remove('hidden');
    } else {
      searchSong;
    }
  });
  };
