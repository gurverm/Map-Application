var searchHistory = [];

function recentSongs() {
    const lyricsValue = $('#search-lyrics').val();
    const artistValue = $('#search-artist').val();
    const searchInfo = lyricsValue + " ⫶ " + artistValue;

    // Prevent duplicates in search history.
    if (!searchHistory.includes(searchInfo)){
        // Add the searched info object to the search history array
        searchHistory.unshift(searchInfo);
        // Store the updated search history array in local storage
        if(searchHistory.length > 10) {
            searchHistory.pop();
        }
        localStorage.setItem('search', JSON.stringify(searchHistory));

        displaySongs();
    }
}

function displaySongs(){
    $("#search-history-list li").empty();
    $("#no-history").remove();

    for (let i = 0; i < searchHistory.length; i++){
        const newSearch = $('#' + String(i));
        newSearch.append(`
            <button type="button">${searchHistory[i]}</button>
        `);
        newSearch.removeClass("hidden")
    }
}

$(function () {
    if (localStorage.getItem("search")) {
        searchHistory = JSON.parse (localStorage.getItem("search"));
    }
});
