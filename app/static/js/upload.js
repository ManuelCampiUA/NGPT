let pendingUploadRequest = false;
let fileUploaded = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('upload').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!pendingUploadRequest)
            await upload(filePreparation());
        if (fileUploaded) {
            setTimeout(() => { loadingFileList(getFileList()) }, 1000);
            fileUploaded = false;
        }
    });
});

function filePreparation() {
    const PDFs = document.querySelector('input[type="file"][multiple]');
    const formData = new FormData();
    for (const [i, PDF] of Array.from(PDFs.files).entries()) {
        formData.append(`file_${i}`, PDF);
    }
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
        const response = await fetch('getFileList');
        if (!response.ok)
            throw new Error("Network response was not OK");
        const result = await response.json();
        return result['response'];
    } catch (error) {
        console.error("There has been a problem with your getFileList operation:", error);
    }
}

async function loadingFileList(result) {
    files = await result;
    if (files.length === 0)
        return;
    const fileList = document.getElementById('fileList');
    while (fileList.firstChild)
        fileList.removeChild(fileList.firstChild);
    files.forEach(file => {
        const item = document.createElement('li');
        item.appendChild(document.createTextNode(file));
        fileList.appendChild(item);
    })
}
