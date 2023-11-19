'use strict';

class AutoFill {
    constructor() {
        chrome.storage.local.get(['firstName', 'lastName', 'resumeFile'], (data) => {
            this.firstName = data.firstName;
            this.lastName = data.lastName;
            this.fullName = `${data.firstName} ${data.lastName}`;
            this.resumeFileData = data.resumeFile; // This is expected to be a data URL
        });
    }

    fillForms() {
        console.log("Starting to autofill forms");
        // Wait for the data to be loaded before processing forms
        setTimeout(() => {
            const forms = document.forms;
            Array.from(forms).forEach(form => this.fillForm(form));
        }, 1000); // Adjust timeout as needed
    }

    fillForm(form) {
        console.log("Filling form:", form);
        Array.from(form.elements).forEach(element => {
            if (element.type === "text" || element.type === "email" || element.type === "textarea") {
                this.fillTextElement(element);
            } else if (element.type === "file") {
                this.fillFileInput(element);
            }
        });
    }

    fillTextElement(element) {
        const label = this.getLabelForElement(element).toLowerCase();
        if (label.includes('first name') || label.includes('given name')) {
            element.value = this.firstName;
            console.log(`Filled ${element.name} with ${this.firstName}`);
        } else if (label.includes('last name') || label.includes('surname')) {
            element.value = this.lastName;
            console.log(`Filled ${element.name} with ${this.lastName}`);
        } else if (label.includes('name') || label.includes('full name')) {
            element.value = this.fullName;
            console.log(`Filled ${element.name} with ${this.fullName}`);
        }
    }

    fillFileInput(element) {
        if (this.resumeFileData && element.id === "resumeUploadInputId") { // Replace with your actual file input ID
            const fileData = this.resumeFileData;
            const blob = this.dataURLtoBlob(fileData);
            const fileName = "resume.pdf"; // Modify to get the actual file name if needed

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(new File([blob], fileName, { type: 'application/pdf' }));
            element.files = dataTransfer.files;
            console.log(`Uploaded resume file to ${element.name}`);
        }
    }

    dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    getLabelForElement(element) {
        const labels = document.getElementsByTagName('label');
        for (const label of labels) {
            if (label.htmlFor === element.id) {
                return label.textContent;
            }
        }
        return element.name;
    }
}

// Example Usage:
const autoFiller = new AutoFill();
autoFiller.fillForms();
