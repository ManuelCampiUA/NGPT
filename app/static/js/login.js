let pendingRequest = false;
const loginForm = document.getElementById('login');
const loginUsername = loginForm.elements['username'];
const loginPassword = loginForm.elements['password'];

const login = async () => {
    try {
        pendingRequest = true;
        loginUsername.value = loginUsername.value.trim();
        loginPassword.value = loginPassword.value.trim();
        const formData = new FormData(loginForm);
        await axios.post('login', formData);
        const params = new URLSearchParams(document.location.search);
        const next = params.size ? params.get('next') : 'chat';
        window.location.assign(next);
    } catch (error) {
        console.error(
            'There has been a problem with your login operation:',
            error.message
        );
        if (error.response) {
            errorAlert(error.response.data['response']);
            return;
        }
        errorAlert('Error');
    } finally {
        pendingRequest = false;
    }
};

document.addEventListener('DOMContentLoaded', () =>
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!pendingRequest) login();
    })
);
