const fileSizeLabel = document.querySelector('.file_size');

function getFileSize(file) {
    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    return fileSizeInMB;
}