function StoreFListAsCookie(address, filterList, filterMode){
    chrome.cookies.set({ url: address, name: "TTV_Following_Filter_Cookie", value: filterList + "|" + filterMode });
}

function GetCookie(address, callback){
    chrome.cookies.get({"url": address, "name": "TTV_Following_Filter_Cookie"}, function(cookie) {
        if(callback) {
            callback(cookie.value);
        }
    });
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      //if(request.filters != null && request.filterMode != null){
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        console.log(request.filters);
        if(request.filters != null && request.filterMode != null){
            StoreFListAsCookie(sender.tab.url, request.filters, request.filterMode);
        }
        chrome.cookies.get({"url": sender.tab.url, "name": 'TTV_Following_Filter_Cookie'}, function(cookie) {
            console.log(cookie.value);
            sendResponse({cookieFilters: cookie.value});
        });
        // GetCookie(sender.tab.url, function(val){
        //     sendResponse({cookieFilters: val});
        // })
        // sendResponse({cookieFilters: GetCookie(sender.tab.url, function(val){
        //     return val;
        // })});
      //}else{
        // GetCookie(sender.tab.url, function(val){
        //     sendResponse({cookieFilters: val})
        // });
        //console.log(cookieJar);
        //console.log(GetCookie(sender.tab.url));
      //}
      return true;
    }
  );