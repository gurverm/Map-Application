var searchHistory = [];

function recentSongs() {
    const lyricsValue = $('#search-lyrics').val();
    const artistValue = $('#search-artist').val();
    const searchInfo = lyricsValue + " ⫶ " + artistValue;
    const storedVal = JSON.parse(localStorage.getItem('search'));

    // Retrieve the search history from local storage, or create an empty array if none exist
    if (storedVal == null){
        searchHistory = [searchInfo];
        localStorage.setItem('search', JSON.stringify(searchHistory));
        // $("#0").text(searchHistory[0]);
    }
    else if (!storedVal.includes(searchInfo)){
        searchHistory = storedVal;
        // Add the searched info object to the search history array
        searchHistory.unshift(searchInfo);
        // Store the updated search history array in local storage
        if(searchHistory.length > 10) {
            searchHistory.pop();
        }

        localStorage.setItem('search', JSON.stringify(searchHistory));

        displaySongs();

        // // Create a new button element with the search label
        // for (let i = 0; i < searchHistory.length; i++){
        //     const newSearch = $('#' + String(i));
        //     newSearch.append(`<button>${searchHistory[i]}</button>`);
        //     newSearch.removeClass("hidden");
        // }
    }
}

function displaySongs(){
    searchHistory = JSON.parse(localStorage.getItem('search'));
    for (let i = 0; i < JSON.parse(localStorage.getItem('search')).length; i++){
        const newSearch = $('#' + String(i));
        newSearch.append(`
            <button type="button">${searchHistory[i]}</button>
        `);
        newSearch.removeClass("hidden")
    }
}
