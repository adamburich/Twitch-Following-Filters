function htmlToElements(html) {
  var template = document.createElement('template');
  template.innerHTML = html;
  return template.content.childNodes;
}

let UIBuilt = false;

var interval = setInterval(function () {
  if (!UIBuilt && (window.location.href === "https://www.twitch.tv/directory/following/live" || window.location.href === "https://www.twitch.tv/directory/following")) {
    var styling = document.createElement("link");
    styling.setAttribute("rel", "stylesheet");
    styling.setAttribute("type", "text/css");
    styling.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
    styling.setAttribute("crossorigin", "anonymous");

    var head = document.getElementsByTagName("head")[0];
    head.append(styling);

    var insert_here = document.createElement("div");
    insert_here.setAttribute("id", "insert_filter_here");
    var main = document.getElementsByTagName("main")[0];
    //Error here, sometimes this is undefined - Watching a channel, click following, big_brother undefined
    var big_brother = main.querySelector("div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div > div > div > div > div > div:nth-child(2)");

    var child_nodes = htmlToElements(`<div style="margin-bottom:28px; width:100%;">
        <div style="display:flex; flex-direction:row; flex-wrap:nowrap; padding:5px; padding-left:1px;">
          <div id="mode-div">
              <select name="mode" id="mode" style="height:35px; margin-right:10px; padding-left:7px; border-radius:10px; background-color:#5c6066; border-color:#3c3f43; color:white;">
                <option value="hide">Hide</option>
                <option value="show">Show</option>
              </select>
              <span class="tooltiptext">Filter Mode</span>
          </div>
          <div>
            <textarea id="filter_name" style="height:35px; resize:none; color:white; background-color:#5c6066; border-radius:10px; border-color:#3c3f43; vertical-align:center; padding-left:10px; padding-top:8px;"></textarea>
            <button id="add-filter" class="filter-buttons">✓
                <span class="tooltiptext">Add Filter</span>
            </button>
          </div>
          <div>
            <button id="trashcan" class="fa fa-trash-o filter-buttons">
                <span class="tooltiptext">Clear Filters</span>
            </button>
        
          </div>
        </div>
        <div style="display:flex; width:100%; height:30px; flex-wrap:nowrap;">
            <div id="filter-container">
            </div>
        </div>
        </div>`);

    for (var i = 0; i < child_nodes.length; i++) {
      insert_here.appendChild(child_nodes[i])
    }
    big_brother.insertAdjacentElement("afterend", insert_here);

    var input = document.getElementById("filter_name");
    input.addEventListener("keypress", function (event) {
      // If the user presses the "Enter" key on the keyboard
      if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("add-filter").click();
      }
    });

    //clearInterval(interval)
    UIBuilt = true;
    Setup();
  }
}, 1000)