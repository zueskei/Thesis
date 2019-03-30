const OPACITY_THRESHOLD= 0.1;
const ZINDEX_THRESHOLD= 1;

let iframe_array= new Array();
let suspiciousIframe= new Array();

document.addEventListener("readystatechange", function(){
    if(document.readyState == "complete"){
        iframe_array= document.getElementsByTagName("iframe");
    }
    if(iframe_array.length != 0){
        suspiciousIframe= updateSuspiciousList(iframe_array);
        if(suspiciousIframe.length > 0){
            chrome.runtime.sendMessage({todo: "showPageAction"}); 
        }
    }
});



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "deleteiframe"){
        suspiciousIframe.forEach(function(iframe){
            iframe.remove();
        })
    }
})

function updateSuspiciousList(_iframeList){
    let suspiciousList= new Array();
    let i= 0;
    for(i; i < _iframeList.length; i++){
        if(isSuspicious(_iframeList[i])){
            suspiciousList.push(_iframeList[i]);
        }
    }
    return suspiciousList;
}

//-----------------------//
// IMPORTANT: logic to define a iframe is harmful or not
function isSuspicious(_iframe){
    let zindex_value= getComputedStyle(_iframe).zIndex;
    let opacity_value= $(_iframe).css("opacity");
    if(opacity_value <= OPACITY_THRESHOLD && zindex_value >= ZINDEX_THRESHOLD){
        return true;
    }
    return false;
}