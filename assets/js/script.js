function searchSong(lyrics, artist) {
  var spotifyAccessToken;

  (function getSpotifyAccess() {
    // Execute immediately.
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
    // Might be better to make query more specific (also search by artist, album, etc.)
    // But can't find song in Spotify sometimes  --Peter
    let query = `track:${songs[count].song} artist:${songs[count].artist}`;

    fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let spotifyRes = data.tracks.items[0];

        if (spotifyRes) {
          songs[count].cover = spotifyRes.album.images[1].url;
          songs[count].duration = spotifyRes.duration_ms;
          songs[count].explicit = spotifyRes.explicit;
          songs[count].popularity = spotifyRes.popularity;
          songs[count].previewUrl = spotifyRes.preview_url;
          songs[count].spotifyUrl = spotifyRes.external_urls.spotify;
        }
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
      <img src="${songs[count].cover}" alt="Album cover art of ${songs[count].album}">
        <ul>
          <li class="text-2xl">
            ${songs[count].song}
          </li>
          <li class="text-xl">
            <i class="fa-solid fa-circle-user"></i> ${songs[count].artist}
          </li>
          <li class="text-xl">
            <i class="fa-solid fa-compact-disc"></i> ${songs[count].album}
          </li>
          <li>Duration: ${songs[count].duration} ms</li>
          <li>Explicit: ${songs[count].explicit}</li>
          <li>Popularity: ${songs[count].popularity}</li>
          <li>
            Preview: <a href="${songs[count].previewUrl}"><i class="fa-solid fa-volume-high fa-2xl"></i><i class="fa-solid fa-volume-xmark fa-2xl"></i></a>
          </li>
          <a href="${songs[count].spotifyUrl}"><i class="fa-brands fa-spotify fa-2xl"></i></a>
        </ul>
    </div>
  `);

  if (count < songs.length - 1) {
    count++;
    // Recurse to add Spotify info to all songs.
    printSongs(songs, count);
  }
}


const searchHistory = $("#recent-searches");
const button = $("<button>").text(test);
searchHistory.append(button);

const searchHistoryList = document.querySelector('#search-history-list');
const lyricsSearchInput = document.querySelector('#search-lyrics');
const artistSearchInput = document.querySelector('#search-artist');
const searchButton = document.querySelector('#search-button');

let searchHistory = [];

searchButton.addEventListener('click', function() {
  // Get the values from both search inputs
  const lyricsValue = lyricsSearchInput.value;
  const artistValue = artistSearchInput.value;
  
  // Combine the values into a single label
  const searchLabel = `${lyricsValue} - ${artistValue}`;
  
  // Check if the search label is already in the search history
  if (!searchHistory.includes(searchLabel)) {
    const newButton = document.createElement('button');
    
    // Set the button's label to the search label
    newButton.innerText = searchLabel;
    
    newButton.addEventListener('click', function() {
      // Set the lyrics search input value to the lyrics portion of the label
      lyricsSearchInput.value = searchLabel.split(' - ')[0];
      
      // Set the artist search input value to the artist portion of the label
      artistSearchInput.value = searchLabel.split(' - ')[1];
      
      searchButton.click();
      // Authenticate request and get song from Spotify.
      fetch(`https://api.spotify.com/v1/search?q=${searchParams}&type=track`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          var trackLink = data.tracks.items[0].external_urls.spotify;
          var previewUrl = data.tracks.items[0].preview_url;
          console.log(trackLink);
          // Add track link to search results and plays the preview
          var searchResultEl = $('<div class="search-result"></div>');
          var trackNameEl = $('<h2></h2>').text(data.tracks.items[0].name);
          var artistNameEl = $('<p></p>').text(data.tracks.items[0].artists[0].name);
          var trackLinkEl = $('<a></a>').text(trackLink).attr('href', trackLink).attr('target', '_blank');
          var previewEl = $('<audio controls></audio>').append($('<source>').attr('src', previewUrl).attr('type', 'audio/mpeg'));
          searchResultEl.append(trackNameEl, artistNameEl, trackLinkEl, previewEl);
          $('#search-results').empty().append(searchResultEl);
          
        });
    });
    
    searchHistoryList.appendChild(newButton);
    searchHistory.push(searchLabel);
  }
});

searchHistory.forEach(function(searchLabel) {
  const newButton = document.createElement('button');
  newButton.innerText = searchLabel;
  newButton.addEventListener('click', function() {
    lyricsSearchInput.value = searchLabel.split(' - ')[0];
    artistSearchInput.value = searchLabel.split(' - ')[1];
    searchButton.click();
  });
  searchHistoryList.appendChild(newButton);
});

$(function () {
  //const modal = document.querySelector('.relative');
  //hideModal();
  $("#search-form").on("submit", function (e) {
    e.preventDefault();

    searchSong($("#search-lyrics").val(), $("#search-artist").val());
  });
});


function showModal() {
  var modal = $("#modal");
  let continueButton = $("#continueButton");
  modal.removeAttr("hidden");
  continueButton.click(function () {
    modal.attr("hidden", "");
  });
}
