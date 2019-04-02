const OPACITY_THRESHOLD= 0.1;
const ZINDEX_THRESHOLD= 1;

let iframe_array= new Array();
let suspiciousIframe= new Array();


iframe_array= document.getElementsByTagName("iframe");

if(iframe_array.length != 0){
    suspiciousIframe= updateSuspiciousList(iframe_array);
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
    let suspiciousList= new Array();
    let i= 0;
    for(i; i < _iframeList.length; i++){
        if(isSuspicious(_iframeList[i])){
            suspiciousList.push(_iframeList[i]);
        }
    }
    return suspiciousList;
}

//-----------------------//-----------------------//
// IMPORTANT: logic to define a iframe is harmful or not
// clickjacking vulnerable constraints:
// ---- opacity <= OPACITY_THRESHOLD (0.1) ----
//
// clickjacking non-vulnerable constraints:
// iframes's z-index < body's z-index
//
function isSuspicious(_iframe){
    let zindex_value= getComputedStyle(_iframe).zIndex;
    let opacity_value= $(_iframe).css("opacity");
    if(opacity_value <= OPACITY_THRESHOLD && zindex_value >= ZINDEX_THRESHOLD){
        return true;
    }
    return false;
}

// Add Observer for changing of style of iframes
var observerConfig = {
	attributes: true,   
	attributeFilter: ['style']
};
var observer = new MutationObserver(styleChangedCallback);

let i= 0;
for(i= 0; i < iframe_array.length; i++){
    observer.observe(iframe_array[i], observerConfig);
}

// var oldIndex = document.getElementsByTagName("iframe").style.zIndex;

function styleChangedCallback(mutations) {
    mutations.forEach(function(mutation){
        if(mutation.attributeName === 'style'){
            console.log("style change");
            console.log(mutation.oldValue);
            console.log(mutation.target);
            iframe_array= document.getElementsByTagName("iframe");
            let i= 0;
            for(i; i < iframe_array.length; i++){
                console.log(iframe_array[i].style.zIndex);
            };
          }
        var newIndex = mutation.target.style.zIndex;
        // if (newIndex !== oldIndex) {
        var newIndex = mutation.target.style.zIndex;
            console.log('new:', newIndex);
    })
    
    // }
}