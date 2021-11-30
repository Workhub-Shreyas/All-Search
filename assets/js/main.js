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

var search_sites = Object.getOwnPropertyNames(search_params);
var search_input = $("#search_query_input");
var keywords = [];

function reconnectServer() {
    // hide "disconnected..." message, show "connecting..."
    $("#disconnected")[0].hidden = true;
    $("#connecting")[0].hidden = false;

    fetch("https://all-search-backend.herokuapp.com/")
        .then((res) => res.json())
        .then((res) => {
            // hide "connecting..." and show connected
            if (res.working) {
                $("#connecting")[0].hidden = true;
                $("#connected")[0].hidden = false;

                window.setTimeout(() => {
                    $("#connected")[0].hidden = true;
                    window.setTimeout(() => {
                        $("#disconnected")[0].hidden = false;
                    }, (30 * 60 * 1000))
                }, (5 * 1000))
            }
        })
}

function openInNewTab(key){
    element = search_params[key];
    opener = window.open(element.url + keywords.join("%20"), "_blank");
    return opener;
}

function refreshCount() {
    let resCount = $(".query-result-cards").length;
    if (resCount === 1)
        $("#result-count-message")[0].innerHTML = `Found a total of ${resCount} result in 4 websites :`;
    else
        $("#result-count-message")[0].innerHTML = `Found a total of ${resCount} results in 4 websites :`;
}

function selectProduct(product) {
    $("#selected_product")[0].innerHTML = product;
    localStorage.setItem("product", product);
    if (keywords.length >= 1) {
        if (keywords[0] !== "Appliances" && keywords[0] !== "NetBackup")
            keywords = [product, "AND", ...keywords]
        else
            keywords[0] = product;
    }
    // console.log(keywords)
}

search_input.on(
    "keyup",
    function (event) {
        product = localStorage.getItem("product");
        keywords = search_input[0].value.trim().split(" ");

        if(keywords.length>0 && keywords[0].length > 0){
            if(product)
                keywords = [product, "AND", ...keywords];
            else
                keywords = []
        }
        else{
            keywords = []
        }
        
        // console.log(keywords)
    }
)

search_sites.forEach(site => {
    search_params[site].btn.on(
        "click",
        () => {
            if (!$("#central_search")[0].reportValidity()) return;
            openInNewTab(site);
            gtag('event', key + "_clicked", {
                'event_category': 'engagement',
                'event_label': key + " clicked",
            });
        }
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

            search_sites.forEach(site => {
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

$("#open_all").on(
    "click",
    function (e) {
        if (!$("#central_search")[0].reportValidity()) return;
        e.preventDefault();

        for(let i=0; i<search_sites.length; i++){
            site = search_sites[i];
            $(`#${site}-results`)[0].innerHTML = "";
            opener = openInNewTab(site);
            if (!opener || opener.closed || typeof opener.closed === 'undefined') {
                alert("Popups are Blocked. Please unblock and retry.")
                break;
            }
        };

        gtag('event', "open_all_clicked", {
            'event_category': 'engagement',
            'event_label': "open_all clicked",
        });
    }
)

reconnectServer();
