let loginStatus = JSON.parse(localStorage.getItem('loginStatus'));

if (!loginStatus) {
    window.location = 'login.html';
}

const greetings = document.querySelector('.greetings');

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // show user's name after sign in
        greetings.innerHTML = 'Howdy, ' + user.displayName + '.';
    }
});

let logout = document.querySelector('.logout');

logout.onclick = () => {
    firebase.auth().signOut().then(function() {
        localStorage.setItem('loginStatus', false);
        window.location = "login.html";
    }).catch(function(error) {
        // An error happened.
        console.log(error)
    });
}