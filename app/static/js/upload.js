let pendingUploadRequest = false;
let fileUploaded = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('upload').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!pendingUploadRequest)
            await upload(file_preparation());
        if (fileUploaded) {
            setTimeout(() => { loading_file_list(get_file_list()) }, 1000);
            fileUploaded = false;
        }
    });
});

function file_preparation() {
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
        console.error("There has been a problem with your fetch operation:", error);
    } finally {
        pendingUploadRequest = false;
    }
}

async function get_file_list() {
    try {
        const response = await fetch('get_file_list');
        if (!response.ok)
            throw new Error("Network response was not OK");
        const result = await response.json();
        return result['response'];
    } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
    }
}

async function loading_file_list(result) {
    files = await result;
    if (files.length === 0)
        return;
    const file_list = document.getElementById('file_list');
    while (file_list.firstChild)
        file_list.removeChild(file_list.firstChild);
    files.forEach(file => {
        const item = document.createElement('li');
        item.appendChild(document.createTextNode(file));
        file_list.appendChild(item);
    })
}
