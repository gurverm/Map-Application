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
