let pendingDeleteRequest = false;

async function deleteFile(event) {
    try {
        if (!pendingDeleteRequest) {
            pendingDeleteRequest = true;
            const liFile = event.target.parentNode.parentNode;
            const fileName = liFile.childNodes[0].textContent;
            await axios.delete('delete', { data: { fileName: fileName } });
            loadingFileList(await getFileList());
            successAlert('Success');
        }
    }
    catch (error) {
        console.error('There has been a problem with your file deletion operation:', error.message);
        console.log(error.response)
        if (error.response) {
            errorAlert(error.response.data['response']);
            return;
        }
        errorAlert('Error');
    } finally {
        pendingDeleteRequest = false;
    }
}
