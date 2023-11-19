'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

// background.js


console.log("At least reached background.js");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Reached background.js");

    if (request.from === 'popup') {
        if (request.subject === 'injectContentScript') {
            console.log("Injecting content script");

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['contentScript.js']
                }, () => {
                    console.log("Content script injected");
                });
            });
        } else {
            console.log("Received an unrecognized request");
        }
    }

    return true; 
});

