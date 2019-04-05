const OPACITY_THRESHOLD= 0.1;
const ZINDEX_THRESHOLD= 1;

let isInitialized= false;
let iframe_array= new Array();
let suspiciousIframe= new Array();
initEnviroment();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    switch (request.todo) {
        case "deleteiframe":
            suspiciousIframe.forEach(function(iframe){
                iframe.remove();
            })
            chrome.runtime.sendMessage({todo: "hidePageAction"});
            break;
        case "focusedTabChanged":
            if(!isInitialized){
                isInitialized= true;
                initEnviroment();
                processClickjackingTest();
            }
            break;
        case "tabReplaced":
        case "tabUpdated":
        default:
            isInitialized= true;
            initEnviroment();
            processClickjackingTest();
            break;
    }
})

function getSuspiciousList(_iframeList){
    let suspiciousList= new Array();
    let i= 0;
    for(i; i < _iframeList.length; i++){
        if(isSuspicious(_iframeList[i])){
            suspiciousList.push(_iframeList[i]);
        }
    }
    return suspiciousList;
}

function processClickjackingTest(){
    if(iframe_array.length != 0){
        suspiciousIframe= getSuspiciousList(iframe_array);
        if(suspiciousIframe.length > 0){
            chrome.runtime.sendMessage({todo: "showPageAction"}); 
        }
        else {
            chrome.runtime.sendMessage({todo: "hidePageAction"});
        }
    }
}

function initEnviroment(){
    iframe_array= document.getElementsByTagName("iframe");
}

//-----------------------//-----------------------//
// CHECK IFRAME IS VULNERABLE?
// IMPORTANT: logic to define a iframe is harmful or not
// clickjacking vulnerable constraints:
// ---- opacity <= OPACITY_THRESHOLD (0.1) ----
//
// clickjacking non-vulnerable constraints:
// iframes's z-index < body's z-index ????
//
// BIG QUESTION: Does z-index needed for clickjacking constrain????
//
function isSuspicious(_iframe){
    let opacity_value= getComputedStyle(_iframe).opacity;
    if(opacity_value <= OPACITY_THRESHOLD){
        return true;
    }
    return false;
}

//-----------------------//-----------------------//
// ADD OBSERVER FOR STYLE CHANGING OF IFRAMES
// Configuration
let observerConfigForStyleOfIframe = {
    attributes: true,
    attributeFilter: ['style'],
    attributeOldValue: true
};

let styleObserver = new MutationObserver(styleChangedCallback);

let i= 0;
for(i= 0; i < iframe_array.length; i++){
    styleObserver.observe(iframe_array[i], observerConfigForStyleOfIframe);
}


function styleChangedCallback(mutations) {
    iframe_array= document.getElementsByTagName("iframe");
    processClickjackingTest();
    // mutations.forEach(function(mutation){
    //     console.log("style change");
    //     if(mutation.oldValue != null)
    //         console.log('old value: ', mutation.oldValue);
    //     console.log(mutation.target);
    //     iframe_array= document.getElementsByTagName("iframe");
    //     let i= 0;
    //     for(i; i < iframe_array.length; i++){
    //         console.log(iframe_array[i].style.zIndex);
    //     };
        
    //     var newIndex = mutation.target.style.zIndex;
    //     var newIndex = mutation.target.style.zIndex;
    //         console.log('new:', newIndex);
    // })
}

let observerConfigForCreationOfIframe= {
    childList: true
}

let iframeCreationObserver = new MutationObserver(iframeCreationCallback);

iframeCreationObserver.observe(document.body, observerConfigForCreationOfIframe);

function iframeCreationCallback(mutations){
    mutations.forEach(function(mutation){
        if(mutation.addedNodes.length != 0){
            for(let i= 0; i < mutation.addedNodes.length; i++){
                if(mutation.addedNodes[i].tagName.toLowerCase() == "iframe"){
                    initEnviroment();
                    processClickjackingTest();
                }
            }
        }
    })
}