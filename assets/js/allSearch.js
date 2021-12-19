all_search_backend_url = "https://all-search-backend.herokuapp.com/search/";

function new_row(data, color) {
    var ele = document.createElement("div");
    ele.classList.value = `card my-3 btn-outline-${color} border border-${color}`;
    if(data.title !== "No results"){
        ele.classList.value+=" query-result-cards"
    }
    ele.innerHTML = `
        <div class="card-body" onclick="window.open('${data.link}', target='_blank')">
            <h5 class="card-title">${data.title}</h5>
        </div>
    `
    return ele;
}

/*
    <p class="card-text">
        ${data.snippet}<br>
        <small class="d-none">${data.link}</small>
    </p>
*/

function fill_data(site, data) {
    $(`#${site}-results`)[0].innerHTML = ""
    data.forEach(item => {
        $(`#${site}-results`)[0].appendChild(new_row(item, search_params[site].color));
    });
}

function search(site){
    query = [...product.get(), ...keywords]
    fetch(`https://all-search-backend.herokuapp.com/search/${site}/${query.join('+')}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        fill_data(site, data.results);
        refreshCount();
    });
}
