import './popup.css';

// popup.js

document.addEventListener('DOMContentLoaded', function() {
    var saveButton = document.getElementById('saveButton');
    var autofillButton = document.getElementById('autofillButton');
    var uploadButton = document.getElementById('uploadButton');
    var fileInput = document.getElementById('resumeUpload');

    uploadButton.addEventListener('click', function() {
        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var reader = new FileReader();

            reader.onloadend = function() {
                chrome.storage.local.set({ 'resumeFile': reader.result }, function() {
                    console.log("Resume file saved");
                });
            };

            reader.readAsDataURL(file);
        }
    });
    
    saveButton.addEventListener('click', function() {
        var firstName = document.getElementById('firstName').value;
        var lastName = document.getElementById('lastName').value;

        chrome.storage.local.set({ firstName: firstName, lastName: lastName }, function() {
                console.log("data is set");

        });
    });

    autofillButton.addEventListener('click', function() {
        alert("runtime message sent");
        chrome.runtime.sendMessage({ from: 'popup', subject: 'injectContentScript' });
    });
});
