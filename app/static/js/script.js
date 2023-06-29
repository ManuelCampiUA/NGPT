let pending_request = false;
let file_uploaded = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('upload').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!pending_request)
            await upload(file_preparation());
        if (file_uploaded) {
            setTimeout(() => { update_file_list(get_file_list()) }, 1000);
            file_uploaded = false;
        }
    });
    document.getElementById('question').addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pending_request)
            QeA();
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
        pending_request = true;
        const response = await fetch('upload', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        alert(result['response']);
        if (result['response'] == 'No selected file')
            throw 'No selected file';
        if (result['response'] == 'Error')
            throw 'Error';
        file_uploaded = true;
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pending_request = false;
    }
}

async function get_file_list() {
    try {
        const response = await fetch('get_file_list');
        const result = await response.json();
        return result['response'];
    } catch (error) {
        console.error('Error:', error);
    }
}

async function update_file_list(result) {
    files = await result;
    if (files.length === 0)
        return;
    let file_list = document.getElementById('file_list');
    while (file_list.firstChild)
        file_list.removeChild(file_list.firstChild);
    files.forEach(file => {
        let item = document.createElement('li');
        item.appendChild(document.createTextNode(file));
        file_list.appendChild(item);
    })
}

async function QeA() {
    try {
        pending_request = true;
        let div = document.getElementById('QeA');
        let question = document.getElementsByName('question')[0].value;
        let span_question = document.createElement('p');
        span_question.appendChild(document.createTextNode(question));
        div.appendChild(span_question);
        document.getElementsByName('question')[0].value = '';
        const response = await fetch('QeA', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        });
        const result = await response.json();
        if (result['response'] === false) {
            alert("No file uploaded");
            throw "No file uploaded";
        }
        let span_response = document.createElement('p');
        span_response.appendChild(document.createTextNode(result['response']));
        div.appendChild(span_response);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pending_request = false;
    }
}
