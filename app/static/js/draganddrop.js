let pendingUploadRequest = false;
const dropArea = document.querySelector('.drop_section');
const fileSelectorInput = document.querySelector('.file-selector-input');
const progressBar = document.getElementById('progress_bar');

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
        loadingFileList(await getFileList());
        successAlert('Success');
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

async function uploadFile(file) {
    if (!pendingUploadRequest)
        await upload(filePreparation(file));
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
    fileSelectorInput.addEventListener('change', () => {
        uploadFile(fileSelectorInput.files);
    });
});
