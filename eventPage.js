const EXTENSION_STATE= {
    RUNNING: 0,
    PAUSED: 1,
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "enablePopup"){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.browserAction.enable(tabs[0].id);
        })
        chrome.browserAction.setIcon({
            path: "icons/harmful16.png",
            tabId: sender.tab.id
        })
        console.alert("123");
    }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "disablePopup"){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.browserAction.disable(tabs[0].id);
        })
        chrome.browserAction.setIcon({
            path: "icons/safe16.png",
            tabId: sender.tab.id
        })
    }
})


chrome.tabs.onActivated.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tab){
        chrome.tabs.sendMessage(tab[0].id, {todo: "focusedTabChanged"})
    })
})

chrome.tabs.onCreated.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tab){
        chrome.tabs.sendMessage(tab[0].id, {todo: "tabCreated"})
    })
})

chrome.tabs.onUpdated.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tab){
        chrome.tabs.sendMessage(tab[0].id, {todo: "tabUpdated"})
    })
})

chrome.tabs.onMoved.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tab){
        chrome.tabs.sendMessage(tab[0].id, {todo: "tabMoved"})
    })
})

chrome.tabs.onReplaced.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tab){
        chrome.tabs.sendMessage(tab[0].id, {todo: "tabReplaced"})
    })
})