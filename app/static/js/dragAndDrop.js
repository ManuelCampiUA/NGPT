let pendingUploadRequest = false;
let fileUploaded = false;
const ulFileList = document.getElementById('file_list');
const dropArea = document.querySelector('.drop_section');
const fileSelector = document.querySelector('.file-selector');
const fileSelectorInput = document.querySelector('.file-selector-input');

function filesPreparation(PDFs) {
    const formData = new FormData();
    for (const [i, PDF] of Array.from(PDFs).entries())
        formData.append(`file_${i}`, PDF);
    return formData;
}

async function upload(formData) {
    try {
        pendingUploadRequest = true;
        const response = await fetch('upload', {
            method: 'POST',
            body: formData
        });
        if (!response.ok)
            throw new Error("Network response was not OK");
        const result = await response.json();
        alert(result['response']);
        if (result['response'] == 'No selected file')
            throw new Error('No selected file');
        if (result['response'] == 'Error')
            throw new Error('Error loading files');
        fileUploaded = true;
    } catch (error) {
        console.error("There has been a problem with your upload operation:", error);
    } finally {
        pendingUploadRequest = false;
    }
}

async function getFileList() {
    try {
        const response = await fetch('file_list');
        if (!response.ok)
            throw new Error("Network response was not OK");
        const result = await response.json();
        return result['response'];
    } catch (error) {
        console.error("There has been a problem with your getFileList operation:", error);
    }
}

function loadingFileList(fileList) {
    while (ulFileList.firstChild)
        ulFileList.removeChild(ulFileList.firstChild);
    Object.keys(fileList).forEach(file => {
        const liItem = document.createElement('li');
        const spanFile = document.createElement('p');
        const spanSize = document.createElement('p');
        spanFile.appendChild(document.createTextNode(file));
        spanSize.appendChild(document.createTextNode(fileList[file]));
        liItem.appendChild(spanFile);
        liItem.appendChild(spanSize);
        ulFileList.appendChild(liItem);
    });
}

async function uploadFile(files) {
    if (!pendingUploadRequest)
        await upload(filesPreparation(files));
    if (fileUploaded) {
        loadingFileList(await getFileList());
        fileUploaded = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.classList.remove('drag-over-effect');
    });
    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.classList.remove('drag-over-effect');
        uploadFile(event.dataTransfer.files);
    });
    window.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.classList.add('drag-over-effect');
    });
    window.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag-over-effect');
    });
    fileSelector.addEventListener('click', () => {
        fileSelectorInput.click();
    });
    fileSelectorInput.addEventListener('change', (event) => {
        uploadFile(fileSelectorInput.files);
    });
});
