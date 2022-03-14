const myForm = document.querySelector('form')

const url = ( window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-curso-node-8.herokuapp.com/api/auth/';

myForm.addEventListener('submit', ev =>{
    ev.preventDefault();
    const formData = {};

    for (let el of myForm.elements){
        if (el.name.length > 0 )
            formData[el.name] = el.value
    }
    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json'}
    })
        .then( res => res.json() )
        .then( ({ msg, token}) => {

            if ( msg ){
                return console.error(msg)
            }

            localStorage.setItem('token', token);
            window.location = 'chat.html';

        })
        .catch(err => {
            console.log(err)
        })
    }
)

function handleCredentialResponse(response) {
    // GOOGLE TOKEN : ID_TOKEN
    // console.log('id_token', response.credential);
    const body = { id_token: response.credential}

    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then( r => r.json() )
        .then( ({ token }) => {
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch( console.warn)
}

const button = document.getElementById('google-signout');
button.onclick = () => {
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke( localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    })
}
