function searchSong(lyrics, artist) {
  var spotifyAccessToken;

  (function getSpotifyAccess() {
    // Execute immediately.
    const clientId = "d1f4e5778128411caa0f75e77acc0c35";
    const clientSecret = "a783b8a0bedb4bd58196734b1b619e47";
    const basicAuth = btoa(`${clientId}:${clientSecret}`);

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
    let musixmatchData = [];

    $.ajax({
      type: "GET",
      data: {
        // Marek's API key... stopped working for Peter for some reason
        // apikey: "8aeb7ff0f51f21a364a803d7a9db035f",
        apikey: "d74273e06e4dea74340b05375a6c9bd3",
        // apikey: "5fad2ed714521f5d0c2d847bb3580af1",
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
        // Internal use
        if (data.message.header.status_code != 200) alert('musixmatch api: ' + data.message.header.status_code);

        // Validation
        if (lyrics == "" || artist == "") {
          showModal();
        } else if (data.message.body.track_list.length == 0) {
          showModal();
        } else {
          // Clear previous search results.
          $("#search-results").empty();

          // Populate search results.
          for (res of data.message.body.track_list) {
            musixmatchData.push({
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

  const formatQuery = function (list) {
    let query = `track:${list.song}%20artist:${list.artist}%20album:${list.album}`;

    return (
      query
        // Make Spotify search more reliable.
        .replaceAll(" (Remastered)", "")
        .replaceAll(" [Edited Version]", "")
        .replaceAll(" Clean", "")
        .replaceAll(" Explicit", "")
        .replaceAll(" Version", "")
        .replaceAll("feat. ", "")
        .replaceAll("and ", "")
        .replaceAll("- ", "")
        .replaceAll("& ", "")
        .replaceAll("'", "")
        .replaceAll('"', "")
    );
  };

  const querySpotify = function (songs, count) {
    fetch(
      `https://api.spotify.com/v1/search?q=${formatQuery(songs[count])}
      &type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const spotifyRes = data.tracks.items[0];

        if (spotifyRes) {
          songs[count].album = spotifyRes.album.name;
          songs[count].artist = concSpotifyArtists(spotifyRes.artists);
          songs[count].cover = spotifyRes.album.images[1].url;
          songs[count].duration = spotifyRes.duration_ms;
          songs[count].explicit = spotifyRes.explicit;
          songs[count].popularity = spotifyRes.popularity;
          songs[count].previewUrl = spotifyRes.preview_url;
          songs[count].song = spotifyRes.name;
          songs[count].spotifyUrl = spotifyRes.external_urls.spotify;
          count++;
        } else {
          // Remove song if it cannot be found in Spotify.
          songs.splice(count, 1);
        }

        if (count < songs.length) {
          // Recurse to add Spotify info to all songs.
          querySpotify(songs, count);
        } else {
          recentSongs();
          // Display search results.
          printSongs(songs, 0);
        }
      });
  };
}

function concSpotifyArtists(artists) {
  let concArtists = artists[0].name
  for (let i = 1; i < artists.length; i++) {
    concArtists += ", " + artists[i].name;
  }
  return concArtists;
}

function printSongs(songs) {
  let explicit;
  let popularity;
  // To display duration in m:ss.
  const formatDuration = function (ms) {
    const min = Math.floor((ms / 60000) % 60);
    const sec = Math.floor((ms / 1000) % 60)
      .toString()
      .padStart(2, "0");
    return `<span class="mx-2 font-mono align-middle">${min}:${sec}</span>`;
  };
  // To display explicit icon if true.
  const getExplicitIcon = function (isExplicit) {
    return isExplicit ? '<i class="fa-solid fa-xmarks-lines mx-2 text-red-800 dark:text-red-500 align-middle"></i>' : '';
  };
  // To display popularity icon.
  const getPopularityIcon = function (popularity) {
    if (popularity >= 75) {
      return '<i class="fa-solid fa-temperature-full mx-2 text-3xl align-middle"></i>';
    } else if (popularity >= 50) {
      return '<i class="fa-solid fa-temperature-three-quarters mx-2 text-3xl align-middle"></i>';
    } else if (popularity >= 25) {
      return '<i class="fa-solid fa-temperature-quarter mx-2 text-3xl align-middle"></i>';
    } else {
      return '<i class="fa-solid fa-temperature-empty mx-2 text-3xl align-middle"></i>';
    }
  };

  for (let song of songs) {
    // Prevent duplicates.
    if (
      $(".song-title").text().includes(song.song) &&
      $(".song-artist").text().includes(song.artist) &&
      $(".song-album").text().includes(song.album)
    ) {
      continue;
    }

    explicit = getExplicitIcon(song.explicit);
    popularity = getPopularityIcon(song.popularity);

  $("#search-results").append(`
    <!-- Search result container -->
    <div class="m-4 flex flex-col rounded-lg bg-white shadow-[0_2px_15px_-3px_#334155,0_10px_20px_-2px_#334155] dark:bg-slate-600 dark:text-slate-300 md:flex-row overflow-hidden">
      <img src="${song.cover}"
      alt="Album cover for ${song.album}"
      class="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg">

      <div class="flex flex-col justify-between m-2 w-full object-contain">
        <div class="flex flex-col sm:flex-row sm:justify-between">
          <!-- Song title and details -->
          <div>
            <h4 class="song-title m-2 mb-0 text-2xl">${song.song}</h4>
            <span class="text-xl">${popularity}${formatDuration(song.duration)}${explicit}</span>
            <ul class= "m-2">
              <li class="song-artist text-xl my-1">
                <i class="fa-solid fa-circle-user"></i> ${song.artist}
              </li>
              <li class="song-album text-xl">
                <i class="fa-solid fa-compact-disc"></i> ${song.album}
              </li>
            </ul>
          </div>
          <!-- Spotify tile -->
          <div>
            <a href="${song.spotifyUrl}" target="_blank" class="sm:mx-2 mx-auto h-auto hover:text-success">
              <i class="fa-brands fa-spotify m-4 mx-6 fa-2xl text-6xl"></i>
            </a>
          </div>
        </div>
        <!-- Preview -->
        <audio controls src="${song.previewUrl}" class="block rounded-full m-2 ml-4 mr-7"></audio>
      </div>
    </div>
  `);
  }
  $("#search-button").removeClass("loading");
}

function showModal() {
  var modal = $("#modal");
  let continueButton = $("#continueButton");
  modal.removeAttr("hidden");
  continueButton.click(function () {
  modal.attr("hidden", "");
  $("#search-button").removeClass("loading");
  });
}

// Core functionality starts here.
$(function () {
  if (localStorage.getItem('search') != null) {
    displaySongs();
  }
  $("#search-form").on("submit", function (e) {
    e.preventDefault();
    searchSong(
      $("#search-lyrics").val().trim(),
      $("#search-artist").val().trim()
    );
    // Show loading spinner.
    $("#search-button").addClass("loading");
  });
});



