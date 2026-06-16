const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const userDetails = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {

        const response = await axios.post(
            'http://localhost:3000/user/signup',
            userDetails
        );

        document.getElementById('message').innerText =
            response.data.message;

    } catch (err) {

        if (err.response.status === 403) {

            document.getElementById('message').innerText =
                'User already exists';

        } else {

            document.getElementById('message').innerText =
                'Request failed';
        }
    }
});