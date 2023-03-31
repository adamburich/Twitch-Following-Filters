function StoreFListAsCookie(address, filterList, filterMode) {
    chrome.cookies.set({ url: address, name: "TTV_Following_Filter_Cookie", value: filterList + "|" + filterMode, expirationDate: (new Date().getTime()/1000) + 2678400});
}

function GetCookie(address, callback) {
    console.log(address);
    chrome.cookies.get({ "url": address, "name": "TTV_Following_Filter_Cookie" }, function (cookie) {
        if (callback) {
            callback(cookie.value);
        }
    });
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (sender.tab.url === "https://www.twitch.tv/directory/following") {
            sender.tab.url += "/live"
        }
        if (request.filters != null && request.filterMode != null) {
            StoreFListAsCookie(sender.tab.url, request.filters, request.filterMode);
        }
        console.log(sender.tab.url)
        chrome.cookies.get({ "url": sender.tab.url, "name": 'TTV_Following_Filter_Cookie' }, function (cookie) {
            sendResponse({ cookieFilters: cookie.value });
        });
        return true;
    }
);

chrome.runtime.onInstalled.addListener(async () => {
    for (const cs of chrome.runtime.getManifest().content_scripts) {
        for (const tab of await chrome.tabs.query({ url: cs.matches })) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: cs.js,
            });
        }
    }
});