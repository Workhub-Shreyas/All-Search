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
var product = new (class {
    constructor() { this.value = localStorage.getItem("product") || "NULL"; }
    get(){
        if(this.value==="NULL"){
            return []
        }
        else{
            return [ this.value, "AND" ]
        }
    }
    set(val){
        this.value = val;
    }
})


function reconnectServer() {
    // hide "disconnected..." message, show "connecting..."
    $("#disconnected")[0].hidden = true;
    $("#connecting")[0].hidden = false;

    fetch("https://allsearch.shreyas-ashtamkar-backends.com/")
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
    query = [...product.get(), ...keywords]
    opener = window.open(element.url + query.join("%20"), "_blank");
    return opener;
}

function refreshCount() {
    let resCount = $(".query-result-cards").length;
    if (resCount === 1)
        $("#result-count-message")[0].innerHTML = `Found a total of ${resCount} results :`;
    else
        $("#result-count-message")[0].innerHTML = `Found a total of ${resCount} results :`;
}

function selectProduct(opt) {
    $("#selected_product")[0].innerHTML = (opt !== "NULL" ? opt :"All Products");
    localStorage.setItem("product", opt);
    product.set(opt);
    if(keywords.length > 0){
        console.log(keywords)
        $("#central_search").submit();
    }
    return false;
}

search_input.on(
    "keyup",
    function (event) {
        console.log("event triggered");
        keywords = search_input[0].value.trim().split(" ");
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

        refreshCount();

        var $form = $(this);

        if(!$("#disconnected")[0].hidden){
            reconnectServer();
        }

        if ($form.data('blocked') !== true) {
            // mark the form as blocked
            $form.data('blocked', true);
            // console.log($form.data)
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

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

if (params.q) {
    console.log(`Works : ${params.q}`);
    search_query_input = $("#search_query_input");
    search_query_input[0].value = params.q;
    keywords = search_query_input[0].value.trim().split(" ");
}

reconnectServer();
