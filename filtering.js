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
    mode = mode_select.value;

    add_filter.addEventListener("click", AddFilter);
    remove_filters.addEventListener("click", ClearFilters);
    mode_select.addEventListener("change", ModeChange);

    var main = document.getElementsByTagName("main")[0];
    setTimeout(function () {
        var following = document.querySelectorAll("div.live-channel-card");
        //console.log(following);
        main.addEventListener("click", function (event) {
            for (let i = 0; i < following.length; i++) {
                if (following[i].contains(event.target)) {
                    UIBuilt = false;
                }
            }
        })
    }, 1000)
    var games = GetGameList();
    var field = document.getElementById("filter_name");
    autocomplete(field, games);
    AdjustCookies();
}

function GetGameList() {
    var games = document.querySelectorAll('[data-test-selector="GameLink"]');
    var gameList = [];
    for(let i = 0; i < games.length; i++){
        //console.log(games[i].innerText)
        if(gameList.indexOf(games[i].innerText) == -1){
            gameList.push(games[i].innerText);
        }
    }
    return gameList;
}

function ApplyFilters() {
    var following = document.querySelector("#following-page-main-content > div:nth-child(1) > div > div").childNodes;
    var hide = mode === "hide";

    for (let i = 0; i < following.length; i++) {
        if (hide) {
            for (let j = 0; j < filterList.length; j++) {
                var inner = following[i].innerHTML.toLowerCase();
                if (inner.indexOf(filterList[j].toLowerCase()) != -1) {
                    following[i].style.display = "none";
                }
            }
        } else {
            for (let j = 0; j < filterList.length; j++) {
                var inner = following[i].innerHTML.toLowerCase();
                if (inner.indexOf(filterList[j].toLowerCase()) == -1) {
                    following[i].style.display = "none";
                }
            }
        }
    }
}

function AddFilter() {
    var filter_val = document.getElementById("filter_name").value;
    document.getElementById("filter_name").value = "";
    filterList[filterList.length] = filter_val;

    AdjustCookies();
}

function ModeChange() {
    mode = mode_select.value;
    var following = document.querySelectorAll("div.live-channel-card");
    for (let i = 0; i < following.length; i++) {
        var channel = following[i].parentNode;
        if (channel.style.display === "none" || channel.style.display === "") {
            channel.style.display = "block";
        } else {
            if (filterList.length > 0) {
                channel.style.display = "none";
            }
        }
    }
    AdjustCookies();
}

function ClearFilters() {
    var following = document.querySelector("#following-page-main-content > div:nth-child(1) > div > div").childNodes;
    var filter_div = document.getElementById("filter-container");
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
            var filters = response.cookieFilters.split("|")[0];
            if (filters.length > 1) {
                filterList = filters.split(",");
            }
            mode = response.cookieFilters.split("|")[1];
            mode_select.value = mode;
            if (filterList.length > 0) {
                AddFilterUIObjects();
            }
            ApplyFilters();
        })();
    } else {
        (async () => {
            const response = await chrome.runtime.sendMessage({ filters: null, filterMode: null });
            var filters = response.cookieFilters.split("|")[0];
            if (filters.length > 1) {
                filterList = filters.split(",");
            }
            mode = response.cookieFilters.split("|")[1];
            mode_select.value = mode;
            if (filterList.length > 0) {
                AddFilterUIObjects();
            }
            ApplyFilters();
        })();
        retrieved = true;
    }

}

function AddFilterUIObjects() {
    var filterContainer = document.getElementById("filter-container");
    for (let i = 0; i < filterList.length; i++) {
        var skip = false;
        for (let j = 0; j < filterContainer.childNodes.length; j++) {
            if (filterContainer.childNodes[j].innerText === filterList[i]) {
                skip = true;
            }
        }
        if (!skip) {
            var to_add = document.createElement("div");
            to_add.innerText = filterList[i];
            to_add.setAttribute("class", "filter");

            filterContainer.appendChild(to_add);
        }
    }
}

window.onload = function () {
    AdjustCookies();
}
