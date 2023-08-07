const ulFileList = document.getElementById('file_list');

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
                const deleteButton = document.createElement('button');
                spanFile.appendChild(document.createTextNode(file));
                spanSize.appendChild(document.createTextNode(fileList[file]));
                deleteButton.onclick = (event) => deleteFile(event);
                spanSize.appendChild(deleteButton);
                liItem.appendChild(spanFile);
                liItem.appendChild(spanSize);
                ulFileList.appendChild(liItem);
            });
            progressBar.setAttribute('value', 0);
        }
    }
    catch (error) {
        console.error('There has been a problem with your loadingFileList operation:', error);
        errorAlert('Error');
    }
}