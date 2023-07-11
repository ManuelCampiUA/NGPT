let pendingUploadRequest = false;
let fileUploaded = false;
const dropArea = document.querySelector('.drop_section')
const listSection = document.querySelector('.list-section')
const listContainer = document.querySelector('.list')
const fileSelector = document.querySelector('.file-selector')
const fileSelectorInput = document.querySelector('.file-selector-input')

// Upload files functions
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
    const fileList = document.getElementById('file_list');
    while (fileList.firstChild)
        fileList.removeChild(fileList.firstChild);
    files.forEach(file => {
        const item = document.createElement('li');
        item.appendChild(document.createTextNode(file));
        fileList.appendChild(item);
    })
}

async function uploadFile(files) {
    if (!pendingUploadRequest)
        await upload(filesPreparation(files));
    if (fileUploaded) {
        loadingFileList(await getFileList());
        fileUploaded = false;

        const file = files[0]; //parte calcolo peso
        const fileSize = getFileSize(file);
        fileSizeLabel.textContent = `${fileSize} MB`;
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
