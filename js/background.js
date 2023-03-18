function StoreFListAsCookie(address, filterList, filterMode){
    chrome.cookies.set({ url: address, name: "TTV_Following_Filter_Cookie", value: filterList + "|" + filterMode });
}

function GetCookie(address, callback){
    console.log(address);
    chrome.cookies.get({"url": address, "name": "TTV_Following_Filter_Cookie"}, function(cookie) {
        if(callback) {
            callback(cookie.value);
        }
    });
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(sender.tab.url === "https://www.twitch.tv/directory/following"){
            sender.tab.url += "/live"
        }
        if(request.filters != null && request.filterMode != null){
            StoreFListAsCookie(sender.tab.url, request.filters, request.filterMode);
        }
        console.log(sender.tab.url)
        chrome.cookies.get({"url": sender.tab.url, "name": 'TTV_Following_Filter_Cookie'}, function(cookie) {
            sendResponse({cookieFilters: cookie.value});
        });
      return true;
    }
  );