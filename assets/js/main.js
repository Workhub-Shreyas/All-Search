var keywords = [], search_input = $("#search_query_input");

var search_params = {
    "isearch": {
        btn: $("#iSearch_btn"),
        url: "https://isearch.veritas.com/content/internal-search/en_US/search-results.html?q=",
        color: "success" 
    },
    "vox": {
        btn: $("#Vox_btn"),
        url: "https://vox.veritas.com/t5/forums/searchpage/tab/message?q=",
        color: "warning"
    },
    "veritas": {
        btn: $("#Veritas_btn"),
        url: "https://www.veritas.com/content/support/en_US/search-results?q=",
        color: "danger" 
    },
    "google": {
        btn: $("#Google_btn"),
        url: "https://google.com/search?q=",
        color: "primary" 
    }
}

search_input.on(
    "keyup",
    function (event) {
        keywords = search_input[0].value.trim().split(" ");
    }
)

function openInNewTab(key){
    element = search_params[key];
    console.log("Opening " + element.url + keywords.join("%20"));
    window.open(element.url + keywords.join("%20"), "_blank");
    self.focus();
    gtag('event', key+"_clicked", {
        'event_category': 'engagement',
        'event_label': key+" clicked",
    });
}

Object.getOwnPropertyNames(search_params).forEach(key => {
    // console.log(search_params[element].url + keywords.join("%20"));
    element = search_params[key];
    element.btn.on(
        "click",
        () => openInNewTab(key)
    )
});

$("#central_search").on(
    "submit",
    function (e) {
        e.preventDefault();
        Object.getOwnPropertyNames(search_params).forEach(key => {
            element = search_params[key];
            console.log("Opening " + element.url + keywords.join("%20"));
            // $("google-results").innerHTML = 
            search(key);
        });
        gtag('event', "all_search_clicked", {
            'event_category': 'engagement',
            'event_label': "all_search clicked",
        });
    }
)
