var filterList = [];
var mode;
var retrieved = false;
var add_filter;
var remove_filters;
var mode_select;

function Setup() {
    add_filter = document.getElementById("add-filter");
    remove_filters = document.getElementById("trashcan");
    mode_select = document.getElementById("mode");
    // console.log("Mode during setup:", mode)

    add_filter.addEventListener("click", AddFilter);
    remove_filters.addEventListener("click", ClearFilters);
    mode_select.addEventListener("change", ModeChange);

    let main = document.getElementsByTagName("main")[0];
    
    let scroll = document.querySelector("#root > div > div.Layout-sc-1xcs6mc-0.kBprba > div > main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content")
    scroll.scrollTo(0, scroll.scrollHeight);
    setTimeout(function(){
        scroll.scrollTo(0, 0);
    }, 500)
    setTimeout(function () {
        let following = document.querySelectorAll("div.live-channel-card");
        //console.log(following);
        main.addEventListener("click", function (event) {
            for (let i = 0; i < following.length; i++) {
                if (following[i].contains(event.target)) {
                    UIBuilt = false;
                }
            }
        })

        let games = GetGameList();
        let field = document.getElementById("filter_name");
        autocomplete(field, games);
        AdjustCookies();
    }, 1000)

}

function GetGameList() {
    let games = document.querySelectorAll('[data-test-selector="GameLink"]');
    let gameList = [];
    for (let i = 0; i < games.length; i++) {
        // console.log(games[i].innerText)
        if (gameList.indexOf(games[i].innerText) == -1) {
            gameList.push(games[i].innerText);
        }
    }
    return gameList;
}

function ApplyFilters(mode_param) {
    let following = document.querySelectorAll("div.live-channel-card");

    let hide_me = [];
    let show_me = [];

    let hide = mode_param === "hide";
    
    let select_mode = document.getElementById("mode");
    if(select_mode != null){
        document.getElementById("mode").value = mode_param;
    }
    
    for(let i = 0; i < following.length; i++){
        let inner = following[i].parentElement.innerText.toLowerCase();
        if(hide){
            // console.log("We should only see this message when dropdown is set to Hide")
            for(let j = 0; j < filterList.length; j++){
                let thisFilter = filterList[j].toLowerCase();
                if(inner.includes(thisFilter)){
                    hide_me.push(following[i].parentElement);
                    if(show_me.includes(following[i].parentElement)){
                        let ind = show_me.indexOf(following[i].parentElement);
                        show_me.splice(ind, 1, );
                    }
                }else{
                    // console.log(inner)
                    // console.log(thisFilter)
                    if(!hide_me.includes(following[i].parentElement)){
                        if(!show_me.includes(following[i].parentElement)){
                            show_me.push(following[i].parentElement);
                        }
                    }
                }
            }
        }else{
            // console.log("We should only see this message when dropdown is set to Show")
            for(let j = 0; j < filterList.length; j++){
                let thisFilter = filterList[j].toLowerCase();
                if(inner.includes(thisFilter)){
                    show_me.push(following[i].parentElement);
                    if(hide_me.includes(following[i].parentElement)){
                        let ind = hide_me.indexOf(following[i].parentElement);
                        hide_me.splice(ind, 1, );
                    }
                }else{
                    if(!show_me.includes(following[i].parentElement)){
                        if(!hide_me.includes(following[i].parentElement)){
                            hide_me.push(following[i].parentElement);
                        }
                    }
                }
            }
        }
    }
    // console.log("Following returned", following.length, "elements")
    // console.log("Hide_me contains", hide_me.length, "elements")
    // console.log("Show_me contains", show_me.length, "elements")
    for(let i = 0; i < hide_me.length; i++){
        hide_me[i].style.display = "none";
    }
    for(let i = 0; i < show_me.length; i++){
        show_me[i].style.display = "block";
    }
}

function AddFilter() {
    let filter_val = document.getElementById("filter_name").value;
    document.getElementById("filter_name").value = "";
    filterList[filterList.length] = filter_val;

    AdjustCookies();
}

function ModeChange() {
    mode = mode_select.value;
    AdjustCookies();
}

function ClearFilters() {
    let following = document.querySelector("#following-page-main-content > div:nth-child(1) > div > div").childNodes;
    let filter_div = document.getElementById("filter-container");
    while (filter_div.firstChild) {
        filter_div.removeChild(filter_div.firstChild);
    }
    filterList = [];
    for (let i = 0; i < following.length; i++) {
        following[i].style.display = "block";
    }
    AdjustCookies();
}

async function AdjustCookies() {
    if (retrieved) {
        (async () => {
            const response = await chrome.runtime.sendMessage({ filters: filterList.join(','), filterMode: mode });
            let filters = response.cookieFilters.split("|")[0];
            if (filters.length > 1) {
                filterList = filters.split(",");
            }
            mode = response.cookieFilters.split("|")[1];
        })();
    } else {
        (async () => {
            const response = await chrome.runtime.sendMessage({ filters: null, filterMode: null });
            let filters = response.cookieFilters.split("|")[0];
            if (filters.length > 1) {
                filterList = filters.split(",");
            }
            mode = response.cookieFilters.split("|")[1];
        })();
        retrieved = true;
    }
    if (filterList.length > 0) {
        AddFilterUIObjects();
    }
    ApplyFilters(mode);

}

function AddFilterUIObjects() {
    let filterContainer = document.getElementById("filter-container");
    for (let i = 0; i < filterList.length; i++) {
        let skip = false;
        if(filterContainer != null){
            for (let j = 0; j < filterContainer.childNodes.length; j++) {
                if (filterContainer.childNodes[j].innerText === filterList[i]) {
                    skip = true;
                }
            }
            if (!skip) {
                let to_add = document.createElement("div");
                to_add.innerText = filterList[i];
                to_add.setAttribute("class", "filter");
    
                filterContainer.appendChild(to_add);
            }
        }
    }
}

window.onload = function () {
    AdjustCookies();
    setTimeout(AdjustCookies, 1000);
}
