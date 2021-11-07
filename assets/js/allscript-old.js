var keywords = "", search_input = $("#search_query_input");


var vox = {
    btn: $("#Vox_btn"),
    url: "https://vox.veritas.com/t5/forums/searchpage/tab/message?q="
};
var isearch = {
    btn: $("#iSearch_btn"),
    url: "https://isearch.veritas.com/content/internal-search/en_US/search-results.html?q="
};
var veritas = {
    btn: $("#Veritas_btn"),
    url: "https://www.veritas.com/content/support/en_US/search-results?q="
};
var google = {
    btn: $("#Google_btn"),
    url: "https://google.com/search?q="
};

search_input.on(
    "keyup",
    function (event) {
        keywords = search_input[0].value.trim().replaceAll(" ", "%20");
    }
)



google.btn.on(
    "click",
    () => {
        console.log("Opening " + element.url);
        window.open(element.url + keywords, '_blank');
    }
)
vox.btn.on(
    "click",
    () => {
        console.log("Opening " + element.url);
        window.open(element.url + keywords, '_blank');
    }
)
isearch.btn.on(
    "click",
    () => {
        console.log("Opening " + element.url);
        window.open(element.url + keywords, '_blank');
    }
)
veritas.btn.on(
    "click",
    () => {
        console.log("Opening " + element.url);
        window.open(element.url + keywords, '_blank');
    }
)
