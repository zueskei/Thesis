var iframe_array= document.getElementsByTagName("iframe");
var suspiciousIframe= [];
var i= 0;
for(i; i < iframe_array.length; i++){
    // if(iframe_array[i].style.opacity == "0"){
    if(window.getComputedStyle(iframe_array[i]).getPropertyValue("opacity") == "0" && window.getComputedStyle(iframe_array[i]).getPropertyValue("z-index") > 0){
        suspiciousIframe.push(iframe_array[i])
    }
}
// iframe_array.forEach(function(ele){
//     if(ele.style.opacity == "0"){
//         suspiciousIframe.push(ele)
//     }
// })

if(suspiciousIframe.length > 0){
    chrome.runtime.sendMessage({todo: "showPageAction"});
    
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo== "changeOpacity"){
        var chosenOpacity= parseFloat(request.opval)/100;
        $('iframe').css('opacity', chosenOpacity);
        chrome.storage.local.set({opacity: request.opval});
    }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo== "changeOpacityActivePage"){
        var opacityValue= parseFloat(request.activePageOpacity)/100;
        $('iframe').css('opacity', opacityValue);
    }
})
