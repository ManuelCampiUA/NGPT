function QeA(event) {
    let keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        let question = document.getElementById('question').value;
        fetch('QeA', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        })
            .then(response => response.json())
            .then(data => { document.getElementById('response').textContent = data.response })
    }
}

function upload() {
    
}
