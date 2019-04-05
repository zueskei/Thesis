chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "showPageAction"){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.pageAction.show(tabs[0].id);
        })
    }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "hidePageAction"){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.pageAction.hide(tabs[0].id);
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

