function recentSongs() {
    const lyricsValue = $('#search-lyrics').val();
    const artistValue = $('#search-artist').val();
    let searchHistory = [];
    const searchInfo = lyricsValue + ", " + artistValue;
    console.log(localStorage.getItem('search'));
  
    // Retrieve the search history from local storage, or create an empty array if none exist
    if (localStorage.getItem('search') == null){
        searchHistory = [searchInfo];
        localStorage.setItem('search', JSON.stringify(searchHistory));
        console.log("does this 1");
        $("#0").text(searchHistory[0]);
    }
    else {
        searchHistory = JSON.parse(localStorage.getItem('search'));
        console.log(searchHistory);
  
        // Add the searched info object to the search history array
        searchHistory.unshift(searchInfo);
        // Store the updated search history array in local storage
        if(searchHistory.length > 10) {
            searchHistory.pop();
        }

        localStorage.setItem('search', JSON.stringify(searchHistory));
  
        // Create a new button element with the search label
        for (let i = 0; i < searchHistory.length; i++){
            let newSearch = $('#' + String(i));
            newSearch.text(searchHistory[i]);
        }
    }
}

function displaySongs(){
    searchHistory = JSON.parse(localStorage.getItem('search'));
    for (let i = 0; i < searchHistory.length; i++){
        let newSearch = $('#' + String(i));
        newSearch.text(searchHistory[i]);
    }
}
