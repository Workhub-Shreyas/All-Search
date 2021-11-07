var keywords = "", search_input = $("#search_query_input");

var search_urls = {
    "vox": {
        btn: $("#Vox_btn"),
        url: "https://vox.veritas.com/t5/forums/searchpage/tab/message?q="
    },
    "isearch": {
        btn: $("#iSearch_btn"),
        url: "https://isearch.veritas.com/content/internal-search/en_US/search-results.html?q="
    },
    "veritas": {
        btn: $("#Veritas_btn"),
        url: "https://www.veritas.com/content/support/en_US/search-results?q="
    },
    "google": {
        btn: $("#Google_btn"),
        url: "https://google.com/search?q="
    }
}

search_input.on(
    "keyup",
    function (event) {
        keywords = search_input[0].value.trim().replaceAll(" ", "%20");
    }
)

function openInNewTab(key){
    element = search_urls[key];
    console.log("Opening " + element.url + keywords);
    window.open(element.url + keywords, "_blank");
    self.focus();
}

Object.getOwnPropertyNames(search_urls).forEach(key => {
    // console.log(search_urls[element].url + keywords);
    element = search_urls[key];
    element.btn.on(
        "click",
        () => openInNewTab(key)
    )
});

function searchAll() {
    Object.getOwnPropertyNames(search_urls).forEach(key => {
        element = search_urls[key];
        console.log("Opening " + element.url + keywords);
        openInNewTab(key);
    });
}
