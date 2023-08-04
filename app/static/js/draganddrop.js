let pendingUploadRequest = false;
let fileUploaded = false;
const dropArea = document.querySelector('.drop_section');
const fileSelectorInput = document.querySelector('.file-selector-input');
const progressBar = document.getElementById('progress_bar');
const ulFileList = document.getElementById('file_list');

function filePreparation(file) {
    const formData = new FormData();
    for (const [i, PDF] of Array.from(file).entries())
        formData.append(`file_${i}`, PDF);
    return formData;
}
const axiosConfig = {
    onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        progressBar.setAttribute('value', percentCompleted);
    }
};

async function upload(formData) {
    try {
        pendingUploadRequest = true;
        await axios.post('upload', formData, axiosConfig);
        fileUploaded = true;
    } catch (error) {
        progressBar.setAttribute('value', 0);
        console.error('There has been a problem with your upload operation:', error.message);
        if (error.response) {
            errorAlert(error.response.data['response']);
            return;
        }
        errorAlert('Error');
    }
    finally {
        pendingUploadRequest = false;
    }
}

async function getFileList() {
    try {
        const response = await axios.get('file_list');
        const result = response.data['response'];
        return result;
    } catch (error) {
        progressBar.setAttribute('value', 0);
        console.error('There has been a problem with your getFileList operation:', error.message);
        if (error.response) {
            errorAlert(error.response.data['response']);
            return null;
        }
        errorAlert('Error');
        return null;
    }
}

function loadingFileList(fileList) {
    try {
        if (fileList) {
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
            progressBar.setAttribute('value', 0);
            successAlert('Success');
        }
    }
    catch (error) {
        console.error('There has been a problem with your loadingFileList operation:', error);
        errorAlert('Error');
    }
    finally {
        fileUploaded = false;
    }
}

async function uploadFile(file) {
    if (!pendingUploadRequest)
        await upload(filePreparation(file));
    if (fileUploaded)
        loadingFileList(await getFileList());
}

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('dragstart', (event) => {
        event.preventDefault();
    });
    window.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.classList.add('drag_over_effect');
    });
    window.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag_over_effect');
    });
    window.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.classList.remove('drag_over_effect');
    });
    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.classList.remove('drag_over_effect');
        uploadFile(event.dataTransfer.files);
    });
    dropArea.addEventListener('click', () => {
        fileSelectorInput.click();
    });
    fileSelectorInput.addEventListener('change', (event) => {
        uploadFile(fileSelectorInput.files);
    });
});
