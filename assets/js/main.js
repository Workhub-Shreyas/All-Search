async function reconnectServer(){
    // hide "disconnected..." message, show "connecting..."
    $("#disconnected")[0].hidden = true;
    $("#connecting")[0].hidden = false;

    await fetch("https://all-search-backend.herokuapp.com/")
    .then((res)=> res.json())
    .then((res) => {
        // hide "connecting..." and show connected
        if(res.working){
            $("#connecting")[0].hidden = true;
            $("#connected")[0].hidden = false;

            window.setTimeout(()=>{
                $("#connected")[0].hidden = true;
                window.setTimeout(()=>{
                    $("#disconnected")[0].hidden = false;
                }, (10*60*1000))
            }, (5*1000))
        }
    })

    return true;
}

reconnectServer();

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

Object.getOwnPropertyNames(search_params).forEach(site => {
    search_params[site].btn.on(
        "click",
        () => openInNewTab(site)
    )
});

$("#central_search").on(
    "submit",
    function (e) {
        e.preventDefault();
        
        var $form = $(this);

        if(!$("#disconnected")[0].hidden){
            reconnectServer();
        }

        if ($form.data('blocked') !== true) {
            // mark the form as blocked
            $form.data('blocked', true);

            Object.getOwnPropertyNames(search_params).forEach(site => {
                $(`#${site}-results`)[0].innerHTML = "";
                search(site);
            });
            
            gtag('event', "all_search_clicked", {
                'event_category': 'engagement',
                'event_label': "all_search clicked",
            });

            window.setTimeout(function() {
                $form.data('blocked', false);
            }, 4000);
        }
    }
)