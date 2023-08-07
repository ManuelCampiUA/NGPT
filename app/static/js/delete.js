let pendingDeleteRequest = false;

async function deleteFile(event) {
    try {
        if (!pendingDeleteRequest) {
            const deleteButtons = document.querySelectorAll('#file_list button');
            let buttonIndex;
            pendingDeleteRequest = true;
            deleteButtons.forEach((button, index) => {
                if (button === event.target) {
                    buttonIndex = index;
                    return;
                }
            });
            await axios.delete(`delete/${buttonIndex}`);
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
