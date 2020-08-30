let loginStatus = JSON.parse(localStorage.getItem('loginStatus'));

if (loginStatus) {
    window.location = location.origin;
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        localStorage.setItem('auth', JSON.stringify(user));
    } else {
        localStorage.clear()
    }
});

const loginCard = document.querySelector('.loginCard');
const signupCard = document.querySelector('.signupCard');

const gotoSignup = document.querySelector('.gotoSignup');
const gotoLogin = document.querySelector('.gotoLogin');

gotoSignup.onclick = () => {
    loginCard.style.display = 'none';
    signupCard.style.display = 'block';
}

gotoLogin.onclick = () => {
    loginCard.style.display = 'block';
    signupCard.style.display = 'none';
}

const signupForm = document.querySelector('#signupForm');
const loginForm = document.querySelector('#loginForm');

signupForm.onsubmit = () => {
    let signupName = document.querySelector('#signupName');
    let signupEmail = document.querySelector('#signupEmail');
    let signupPw = document.querySelector('#signupPw');

    firebase.auth().createUserWithEmailAndPassword(signupEmail.value, signupPw.value).then((user) => {
        if (user) {
            user.user.updateProfile({
                displayName: signupName.value
            })
        }

        window.location = location.origin;

        localStorage.setItem('loginStatus', true);
    }).catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;

        console.log(`Error code: ${errorCode}, Error msg: ${errorMessage}`);
    });

    return false;
}

loginForm.onsubmit = () => {
    let loginEmail = document.querySelector('#loginEmail');
    let loginPw = document.querySelector('#loginPw');

    firebase.auth().signInWithEmailAndPassword(loginEmail.value, loginPw.value).then((success) => {
        localStorage.setItem('auth', JSON.stringify(success));

        window.location = location.origin;
        localStorage.setItem('loginStatus', true);

    }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });

    return false;
}