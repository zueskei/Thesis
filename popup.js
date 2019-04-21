$(function(){
    $("#delete").click(function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {todo: "deleteiframe"})
        })
    })

    $("#btn-pause").click(function(){
        chrome.runtime.sendMessage({todo: "pauseExtension", pauseTime: 5000});
    })
})