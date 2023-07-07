let pendingUploadRequest = false;
let fileUploaded = false;
const DropZone = document.getElementById('drop_zone');
const dropDefault = document.getElementById('drop_default');
const dropHidden = document.getElementById('drop_hidden');
const fileList = document.getElementById('file_list');

function filesPreparation(files) {
    const formData = new FormData();
    for (const [i, file] of Array.from(files).entries())
        formData.append(`file_${i}`, file);
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
        const response = await fetch('get_file_list');
        if (!response.ok)
            throw new Error("Network response was not OK");
        const result = await response.json();
        return result['response'];
    } catch (error) {
        console.error("There has been a problem with your getFileList operation:", error);
    }
}

function loadingFileList(files) {
    if (files.length === 0)
        return;
    while (fileList.firstChild)
        fileList.removeChild(fileList.firstChild);
    let itemFileList;
    files.forEach(file => {
        itemFileList = document.createElement('li');
        itemFileList.appendChild(document.createTextNode(file));
        fileList.appendChild(itemFileList);
    })
}

async function uploadFiles(files) {
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
    });
    DropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        uploadFiles(event.dataTransfer.files);
        dropDefault.style.display = "block";
        dropHidden.style.display = "none";
    });
    window.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropDefault.style.display = "none";
        dropHidden.style.display = "block";
    });
    window.addEventListener('dragleave', (event) => {
        event.preventDefault();
        dropDefault.style.display = "block";
        dropHidden.style.display = "none";
    });
});