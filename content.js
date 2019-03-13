var iframe_array= document.getElementsByTagName("iframe");
var suspiciousIframe= [];

if(iframe_array.length != 0){
    updateSuspiciousList(iframe_array)
    if(suspiciousIframe.length > 0){
        chrome.runtime.sendMessage({todo: "showPageAction"}); 
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "deleteiframe"){
        suspiciousIframe.forEach(function(iframe){
            iframe.remove();
        })
    }
})

function updateSuspiciousList(_iframeList){
    var i= 0;
    for(i; i < _iframeList.length; i++){
        suspiciousIframe.push(iframe_array[i])
    }
}
