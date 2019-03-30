chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "showPageAction"){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.pageAction.show(tabs[0].id);
        })
    }
})

chrome.tabs.onActivated.addListener(function(info){
    chrome.storage.local.get(['opacity'], function(result){
        if(result.opacity){
            let activeOpacity= result.opacity;
            chrome.tabs.query({active: true, currentWindow: true}, function(tab){
                chrome.tabs.sendMessage(tab[0].id, {todo: "changeOpacityActivePage", activePageOpacity: activeOpacity})
            })
        }
    })
})


