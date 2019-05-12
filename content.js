const OPACITY_THRESHOLD= 0.1;
const ZINDEX_THRESHOLD= 1;

let isInitialized= false;
let iframe_array= new Array();
let suspiciousIframe= new Array();
let styleObserver;
let iframeCreationObserver;
let observerConfigForStyleOfIframe= {
    attributes: true,
    attributeFilter: ['style', 'src'],
    attributeOldValue: true
};
let observerConfigForCreationOfIframe= {
    childList: true
};
styleObserver = new MutationObserver(styleChangedCallback);
iframeCreationObserver = new MutationObserver(iframeCreationCallback);


// FIRST INITIALIZING //
initEnviroment();

//-----------------------------------------//
//----MAIN LISTENERS FOR HANDLING EVENT----//
//-----------------------------------------//
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    switch (request.todo) {
        case "deleteiframe":
            suspiciousIframe.forEach(function(iframe){
                iframe.remove();
            })
            chrome.runtime.sendMessage({todo: "disablePopup"});
            break;
        case "focusedTabChanged":
            console.log("focused");
            if(!isInitialized){
                isInitialized= true;
                runTestWithInit()
            }
            break;
        case "tabUpdated":
            console.log("updated");
            addCustomListener();
        case "tabCreated":
            console.log("created");
        case "tabReplaced":
            console.log("replaced");
        default:
            isInitialized= true;
            runTestWithInit();
            break;
    }
})

//-------------------------------------------------//
//----MAIN FUNCTIONS FOR LOGIC IN THE EXTENSION----//
//-------------------------------------------------//
function getSuspiciousList(_iframeList){
    console.log("get suspicious list");
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
    console.log("process clickjacking test");
    if(iframe_array.length != 0){
        suspiciousIframe= getSuspiciousList(iframe_array);
        if(suspiciousIframe.length > 0){
            chrome.runtime.sendMessage({todo: "enablePopup"}); 
        }
        else {
            chrome.runtime.sendMessage({todo: "disablePopup"});
        }
    }
    else{
        chrome.runtime.sendMessage({todo: "disablePopup"});
    }
}

function initEnviroment(){
    console.log("init");
    iframe_array= document.getElementsByTagName("iframe");
}

function runTestWithInit(){
    console.log("run test with init");
    initEnviroment();
    processClickjackingTest();
}

function addCustomListener(){
    addStyleChangeListener();
    console.log("style change listener added");
    addNodeAddedListener();
    console.log("node added listener added");
}

//---------------------------//--------------------------//
//-------------CHECK IFRAME IS VULNERABLE?---------------//
// IMPORTANT: logic to define a iframe is harmful or not //
// --------clickjacking vulnerable constraints:----------//
// -------- opacity <= OPACITY_THRESHOLD (0.1) ----------//
//
// Clickjacking non-vulnerable constraints:--------------//
// iframes's z-index < body's z-index ????---------------//
//
// BIG QUESTION: Does z-index needed for clickjacking constrain????
//
function isSuspicious(_iframe){
    let opacity_value= getComputedStyle(_iframe).opacity;
    if(opacity_value <= OPACITY_THRESHOLD){
        console.log(_iframe);
        if(_iframe.src == "about:blank"){
            console.log("here about:blank");
            return false;
        }
        return true;
    }
    return false;
}

//-----------------------//-----------------------//
// ADD OBSERVER FOR STYLE CHANGING OF IFRAMES
//

function addStyleChangeListener(){let i= 0;
    for(i= 0; i < iframe_array.length; i++){
        styleObserver.observe(iframe_array[i], observerConfigForStyleOfIframe);
    }
}

function styleChangedCallback(mutations) {
    console.log("STYLE CHANGED LISTENER");
    runTestWithInit();
}

//-----------------------//-----------------------//
// ADD OBSERVER FOR STYLE ADDING OF IFRAMES
//
function addNodeAddedListener(){
    iframeCreationObserver.observe(document.body, observerConfigForCreationOfIframe);
}

function iframeCreationCallback(mutations){
    console.log("IFRAME ADDED");
    mutations.forEach(function(mutation){
        if(mutation.addedNodes.length != 0){
            for(let i= 0; i < mutation.addedNodes.length; i++){
                if(typeof mutation.addedNodes[i].tagName !== 'undefined'){
                    if(mutation.addedNodes[i].tagName.toLowerCase() == "iframe"){
                        let e= mutation.addedNodes[i];
                        styleObserver.observe(e, observerConfigForStyleOfIframe);
                        runTestWithInit();
                    }
                }
            }
        }
    })
}