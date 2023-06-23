document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('upload').addEventListener('submit', (event) => {
        event.preventDefault();
        upload(file_preparation());
        setTimeout(() => { update_file_list(get_file_list()) }, 1000);
    });
    document.getElementById('question').addEventListener('submit', (event) => {
        event.preventDefault();
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
        const response = await fetch('upload', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        alert(result['response']);
        if (result['response'] == 'No selected file')
            throw 'No selected file';
    } catch (error) {
        console.error('Error:', error);
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
        let question = document.getElementsByName('question')[0].value;
        const response = await fetch('QeA', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        });
        const result = await response.json();
        document.getElementById('response').textContent = result['response'];
    } catch (error) {
        console.error('Error:', error);
    }
}
