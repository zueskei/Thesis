// $(function(){
//     let opacityValue;

//     chrome.storage.local.get(['opacity'], function(result){
//         if(result.opacity){
//             opacityValue= result.opacity;
//             $("#opacityRange").val(opacityValue);
//         }
//     })

//     $("#opacityRange").on("input", function(){
//         opacityValue= $(this).val();
//         // chrome.runtime.sendMessage({todo: "changeOpacity", opval: opacityValue});
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//             chrome.tabs.sendMessage(tabs[0].id, {todo: "changeOpacity", opval: opacityValue})
//         })
//     })
// })

$(function(){
    $("#delete").click(function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {todo: "deleteiframe"})
        })
    })
})