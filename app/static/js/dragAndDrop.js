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
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Upload files with browse button
    fileSelector.onclick = () => fileSelectorInput.click();
    fileSelectorInput.onchange = () => uploadFile(fileSelectorInput.files);

    // When file is over the drag area
    dropArea.ondragover = (event) => {
        event.preventDefault();
        dropArea.classList.add('drag-over-effect');
    }

    // When file leave the drag area
    dropArea.ondragleave = () => {
        dropArea.classList.remove('drag-over-effect');
    }

    // When file drop on the drag area
    dropArea.ondrop = (event) => {
        event.preventDefault();
        dropArea.classList.remove('drag-over-effect');
        uploadFile(event.dataTransfer.files);
    }
});
