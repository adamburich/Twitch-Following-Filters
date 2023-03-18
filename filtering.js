var filterList = [];
var mode;
var retrieved = false;

var add_filter = document.getElementById("add-filter");
var remove_filters = document.getElementById("trashcan");
var mode_select = document.getElementById("mode");
mode = mode_select.value;

add_filter.addEventListener("click", AddFilter);
remove_filters.addEventListener("click", ClearFilters);
mode_select.addEventListener("change", ModeChange);


function ApplyFilters(){
    var following = document.querySelector("#following-page-main-content > div:nth-child(1) > div > div").childNodes;
    var hide = mode === "hide";

    for(let i = 0; i < following.length; i++){
        if(hide){
            for(let j = 0; j < filterList.length; j++){
                var inner = following[i].innerHTML.toLowerCase();
                if(inner.indexOf(filterList[j].toLowerCase()) != -1){
                    following[i].style.display = "none";
                }
            }
        }else{
            for(let j = 0; j < filterList.length; j++){
                var inner = following[i].innerHTML.toLowerCase();
                if(inner.indexOf(filterList[j].toLowerCase()) == -1){
                    following[i].style.display = "none";
                }
            }
        }
    }
}

function AddFilter(){
    var filter_val = document.getElementById("filter_name").value;
    filterList[filterList.length] = filter_val;
    document.getElementById("filter_name").value = "";
    var to_add = document.createElement("div");
    to_add.innerText = filter_val;
    to_add.setAttribute("class", "filter");

    var filterContainer = document.getElementById("filter-container");

    filterContainer.appendChild(to_add);
    
    //In theory this call to ApplyFilters() doesn't need to be here
    //If we fill out the if(retrieved) branch and use the response object there we can apply the filters there and remove the call here.
    //But alas, it does not matter, it's been a long day, the program works, and I do not care.
    ApplyFilters();
    AdjustCookies();
}

function ModeChange(){
    mode = mode_select.value;
    var following = document.querySelector("#following-page-main-content > div:nth-child(1) > div > div").childNodes;
    for(let i = 0; i < following.length; i++){
        if(following[i].style.display === "none"){
            following[i].style.display = "block";
        }else{
            if(filterList.length > 0){
                following[i].style.display = "none";
            }
        }
    }
    AdjustCookies();
}

function ClearFilters(){
    var following = document.querySelector("#following-page-main-content > div:nth-child(1) > div > div").childNodes;
    var filter_div = document.getElementById("filter-container");
    while(filter_div.firstChild){
        filter_div.removeChild(filter_div.firstChild);
    }
    filterList = [];
    for(let i = 0; i < following.length; i++){
        following[i].style.display = "block";
    }
    AdjustCookies();
}

async function AdjustCookies(){
    if(retrieved){
        (async () => {
            const response = await chrome.runtime.sendMessage({filters: filterList.join(','), filterMode: mode});
          })();
    }else{
        (async () => {
            const response = await chrome.runtime.sendMessage({filters: null, filterMode: null});
            var filters = response.cookieFilters.split("|")[0];
            if(filters.indexOf(",") != -1){
                filterList = filters.split(",");
            }
            mode = response.cookieFilters.split("|")[1];
            if(filterList.length > 0){
                AddFilterUIObjects();
            }
            ApplyFilters();
          })();
          retrieved = true;
    }
    
}

function AddFilterUIObjects(){
    var filterContainer = document.getElementById("filter-container");
    for(let i = 0; i < filterList.length; i++){
        var to_add = document.createElement("div");
        to_add.innerText = filterList[i];
        to_add.setAttribute("class", "filter");
    
        filterContainer.appendChild(to_add);
    }
}

window.onload = function(){
    AdjustCookies();
}