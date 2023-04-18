function searchSong(lyrics, artist) {
  var spotifyAccessToken;

  (function getSpotifyAccess() { // Execute immediately.
    let clientId = "d1f4e5778128411caa0f75e77acc0c35";
    let clientSecret = "a783b8a0bedb4bd58196734b1b619e47";
    let basicAuth = btoa(`${clientId}:${clientSecret}`);

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
        spotifyAccessToken = data.access_token;
        queryMusixmatch();
      });
  })();

  var queryMusixmatch = function () {
    // Marek's API key... stopped working for Peter for some reason
    // apikey: "8aeb7ff0f51f21a364a803d7a9db035f",
    let musixmatchData = [];

    $.ajax({
      type: "GET",
      data: {
        apikey: "d74273e06e4dea74340b05375a6c9bd3",
        q_lyrics: lyrics,
        q_artist: artist,
        //f_music_genre_id: "20",
        format: "jsonp",
        callback: "jsonp_callback",
      },
      url: "http://api.musixmatch.com/ws/1.1/track.search?page_size=10&page=1&s_track_rating=desc",
      dataType: "jsonp",
      jsonpCallback: "jsonp_callback",
      contentType: "application/json",
      success: function (data) {
        console.log(data);
        // Validation
        if (lyrics == "" || artist == "") {
          showModal();
          console.log("nothing");
        } else {
          // Clear previous search results.
          $("#search-results").empty();

          // Populate search results.
          for (res of data.message.body.track_list) {
            musixmatchData.push({
              id: res.track.track_id,
              song: res.track.track_name,
              artist: res.track.artist_name,
              album: res.track.album_name,
            });
          }
          querySpotify(musixmatchData, 0);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  };

  var querySpotify = function (songs, count) {
    let elem = songs[count];
    // Might be better to make query more specific (also search by artist, album, etc.)
    // But can't find song in Spotify sometimes  --Peter
    let query = `track:${elem.song}`;

    fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        elem.cover = data.tracks.items[0].album.images[1].url;
        elem.duration = data.tracks.items[0].duration_ms;
        elem.explicit = data.tracks.items[0].explicit;
        elem.popularity = data.tracks.items[0].popularity;
        elem.previewUrl = data.tracks.items[0].preview_url;
        elem.spotifyUrl = data.tracks.items[0].external_urls.spotify;
      })
      .then(() => {
        count++;
        if (count < songs.length) {
          // Recurse to add Spotify info to all songs.
          querySpotify(songs, count);
        } else {
          // Display search results.
          printSongs(songs, 0);
        }
      });
  };
}

function printSongs(songs, count) {
  // TODO: Update appearance here. --Peter
  $("#search-results").append(`
    <div class="result-card border border-gray-200 rounded px-6 py-2 w-3/4">
      <img src="${songs[count].cover}">
        <ul>
          <li class="text-xl">${songs[count].artist}</li>
          <li class="text-2xl">${songs[count].song}</li>
          <li>Duration: ${songs[count].duration} ms</li>
          <li>Explicit: ${songs[count].explicit}</li>
          <li>Popularity: ${songs[count].popularity}</li>
          <li>Preview: ${songs[count].previewUrl}</li>
          <li>Spotify: ${songs[count].spotifyUrl}</li>
        </ul>
    </div>
  `);

  if (count < songs.length - 1) {
    count++;
    // Recurse to add Spotify info to all songs.
    printSongs(songs, count);
  }
}

$(function () {
  //const modal = document.querySelector('.relative');
  //hideModal();
  $("#search-form").on("submit", function (e) {
    e.preventDefault();

    searchSong($("#search-lyrics").val(), $("#search-artist").val());
  });
});
var test = "test-button";

const searchHistory = $("#recent-searches");
const button = $("<button>").text(test);
searchHistory.append(button);

function showModal() {
  var modal = $("#modal");
  let continueButton = $("#continueButton");
  modal.removeAttr("hidden");
  continueButton.click(function () {
    modal.attr("hidden", "");
  });
}
