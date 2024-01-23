const signUpName = document.getElementById('signUpName');
const signUpEmail = document.getElementById('signUpEmail');
const signUpPassword = document.getElementById('signUpPassword');
const signUpBtn = document.getElementById('signUpBtn');
const signInEmail = document.getElementById('signInEmail');
const signInPassword = document.getElementById('signInPassword');
const loginBtn = document.getElementById('loginBtn');
const changePassword = document.getElementById('changePassword');
const changeName = document.getElementById('changeName');
const deleteAccount = document.getElementById('deleteAccount');
const exist = document.getElementById('exist');
const incorrect = document.getElementById('incorrect');
const header = document.querySelector('header');
const hidePopup = document.querySelectorAll('.hide');
const existPasswordEmail = document.getElementById('existPasswordEmail');
const newPassword = document.getElementById('newPassword');
const existNameEmail = document.getElementById('existNameEmail');
const newName = document.getElementById('newName');
const existdeletEmail = document.getElementById('existdeletEmail');
const passwordError = document.getElementById('passwordError');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const splash = document.getElementById('splash');
const session = document.getElementById('session');
const wel = document.getElementById('wel');
const come = document.getElementById('come');
const sessionUser = localStorage.getItem('sessionUsername');
const google = document.getElementById('google');

// Check for session user on page load
window.addEventListener('load', function () {

    onAuthStateChanged(auth, (user) => {
        if (user) {
            splash.style.background = '#000'
            session.style.display = 'none'
            window.location.assign('home.html');
        }
    });

    if (sessionUser) {
        splash.style.background = '#000'
        session.style.display = 'none'
        window.location.assign('home.html');
    } else {
        setTimeout(() => {
            wel.style.display = 'none';
            come.style.display = 'block';
        }, 1300);
    }
});

// F I R E B A S E

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
import { getDatabase, get, ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAOjinb4OOLrlr1y1MTkF7w08exkYp6cPM",
    authDomain: "login-system7.firebaseapp.com",
    projectId: "login-system7",
    storageBucket: "login-system7.appspot.com",
    messagingSenderId: "1061721003230",
    appId: "1:1061721003230:web:d277760a8cacf99a5e9e4f"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const userRef = ref(database);
const fireStore = getFirestore(app);
const auth = getAuth();
const providerGoogle = new GoogleAuthProvider();

// Sign in with Google
const SignUpGoogle = async () => {
    providerGoogle.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, providerGoogle);
    console.log('User signed in successfully');
    window.location.assign('home.html');
};

google.addEventListener('click', SignUpGoogle);

// Sign up manually

function AddData(e) {
    e.preventDefault();

    signUpName.addEventListener('input', validateSignUpInputs);
    signUpEmail.addEventListener('input', validateSignUpInputs);
    signUpPassword.addEventListener('input', validateSignUpInputs);

    if (validateSignUpInputs() === true) {
        const email = signUpEmail.value.replace(/[^a-zA-Z0-9 ]/g, '');
        const userRef = ref(database, 'Users/' + email);

        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                exist.innerText = 'Email already exists';
                exist.style.visibility = 'visible';
            } else {

                set(userRef, {
                    name: signUpName.value,
                    email: signUpEmail.value,
                    password: signUpPassword.value
                }).then(() => {
                    exist.innerText = 'Success .. "login" to access ^_^';
                    exist.style.color = '#00a800';
                    exist.style.textShadow = '0 0 1px green';
                    exist.style.visibility = 'visible';
                    setFirestore(signUpName.value, signUpEmail.value, signUpPassword.value);
                    clearInputsField();
                    clearPopupInputs();
                }).catch((error) => {
                    exist.innerText = `${error.message}`;
                    exist.style.visibility = 'visible';
                });
            }
        })
    }

}

function RetData(e) {

    e.preventDefault();

    signInEmail.addEventListener('input', validateLoginInputs);
    signInPassword.addEventListener('input', validateLoginInputs);

    if (validateLoginInputs() === true) {
        const enteredEmail = signInEmail.value;
        const enteredPassword = signInPassword.value;

        const userRefPath = 'Users/' + enteredEmail.replace(/[^a-zA-Z0-9 ]/g, '');

        get(child(userRef, userRefPath))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const storedEmail = snapshot.val().email;
                    const storedPassword = snapshot.val().password;

                    if (enteredEmail === storedEmail && enteredPassword === storedPassword) {
                        clearInputsField();
                        clearPopupInputs();
                        localStorage.setItem('sessionUsername', snapshot.val().name);
                        window.location.assign('home.html');
                    } else {
                        incorrect.innerText = 'Incorrect email or password';
                        incorrect.style.visibility = 'visible';
                    }
                } else {
                    incorrect.innerText = 'User doesn\'t exist';
                    incorrect.style.visibility = 'visible';
                }
            })
            .catch((error) => {
                incorrect.innerHTML = `<span class="error"></span>`;
                incorrect.innerText = `${error.message}`;
                incorrect.style.visibility = 'visible';
            });
    }
}

function UpdatePassword(e) {
    e.preventDefault();

    const PasswordEmail = existPasswordEmail.value;
    const newPasswordValue = newPassword.value;

    const userRefPath = 'Users/' + PasswordEmail.replace(/[^a-zA-Z0-9 ]/g, '');

    const userRef = ref(database, userRefPath);

    // Validate if any of the fields are empty
    if (PasswordEmail.trim() === "" || newPasswordValue.trim() === "") {
        passwordError.innerText = 'All inputs are required';
        passwordError.style.visibility = 'visible';
        return;
    }

    // Validate if the new password has at least 6 characters
    if (newPasswordValue.trim().length < 6) {
        passwordError.innerText = 'Password must have at least 6 characters';
        passwordError.style.visibility = 'visible';
        return;
    }

    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                update(userRef, { password: newPasswordValue });
                showToast(`Password Changed Successfully <span class="founduser">${snapshot.val().name}</span>`, "success", 5000);
                clearInputsField();
                clearPopupInputs();
                closePopup('popup1');
            } else {
                passwordError.innerText = 'User not found .. Please sign up first or provide a valid email';
                passwordError.style.visibility = 'visible';
            }
        })
        .catch((error) => {
            passwordError.innerText = `${error.message}`;
            passwordError.style.visibility = 'visible';
        });
}

function UpdateName(e) {
    e.preventDefault();

    const NameEmail = existNameEmail.value;
    const newNameValue = newName.value;

    const userRefPath = 'Users/' + NameEmail.replace(/[^a-zA-Z0-9 ]/g, '');

    const userRef = ref(database, userRefPath);

    // Validate if any of the fields are empty
    if (NameEmail.trim() === "" || newNameValue.trim() === "") {
        nameError.innerText = 'All inputs are required';
        nameError.style.visibility = 'visible';
        return;
    }

    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                update(userRef, { name: newNameValue });
                showToast(`Name Changed Successfully <span class="founduser">${newNameValue}</span>`, "success", 5000);
                clearInputsField();
                clearPopupInputs();
                closePopup('popup2');
            } else {
                nameError.innerText = 'User not found .. Please sign up first or provide a valid email';
                nameError.style.visibility = 'visible';
            }
        })
        .catch((error) => {
            nameError.innerText = `${error.message}`;
            nameError.style.visibility = 'visible';
        });
}

function DeleteUser(e) {
    e.preventDefault();

    const deletEmail = existdeletEmail.value;
    const deleteRefPath = 'Users/' + deletEmail.replace(/[^a-zA-Z0-9 ]/g, '');

    const deleteRef = ref(database, deleteRefPath);

    // Validate if any of the fields are empty
    if (deletEmail.trim() === "") {
        emailError.innerText = 'Email is required';
        emailError.style.visibility = 'visible';
        return;
    }

    get(deleteRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                remove(deleteRef);
                showToast("Account Deleted Successfully", "success", 5000);
                clearInputsField();
                clearPopupInputs();
                closePopup('popup3');
            } else {
                emailError.innerText = 'User not found .. Please provide a valid email';
                emailError.style.visibility = 'visible';
            }
        })
        .catch((error) => {
            emailError.innerText = `${error.message}`;
            emailError.style.visibility = 'visible';
        });
}

async function setFirestore(name, email, password) {

    await addDoc(collection(fireStore, 'Users'), {
        name: name,
        email: email,
        password: password
    });
}

function validateSignUpInputs() {
    const emailFormat = /^\S+@\S+\.\S+$/;
    const passwordStrength = /^.{6,}$/;

    if (signUpName.value.trim() === "" || signUpEmail.value.trim() === "" || signUpPassword.value.trim() === "") {
        exist.innerText = 'All inputs are required';
        exist.style.visibility = 'visible';
        exist.style.color = '#e00000';
        signUpName.classList.add('neon');
        signUpEmail.classList.add('neon');
        signUpPassword.classList.add('neon');
        return false;
    }

    if (!emailFormat.test(signUpEmail.value.trim())) {
        exist.innerText = 'Invalid email format';
        exist.style.visibility = 'visible';
        signUpEmail.classList.add('neon');
        signUpName.classList.remove('neon');
        signUpPassword.classList.remove('neon');
        return false;
    }

    if (!passwordStrength.test(signUpPassword.value.trim())) {
        exist.innerText = 'Password must have at least 6 characters';
        exist.style.color = '#e00000';
        exist.style.visibility = 'visible';
        signUpPassword.classList.add('neon');
        signUpName.classList.remove('neon');
        signUpEmail.classList.remove('neon');
        return false;
    }

    // Clear the error message when all fields are filled correctly
    signUpName.classList.remove('neon');
    signUpEmail.classList.remove('neon');
    signUpPassword.classList.remove('neon');
    exist.style.visibility = 'hidden';
    return true;
}

function validateLoginInputs() {
    if (signInEmail.value.trim() === "" || signInPassword.value.trim() === "") {
        incorrect.innerText = 'All inputs are required';
        incorrect.style.visibility = 'visible';
        signInEmail.classList.add('neon');
        signInPassword.classList.add('neon');
        return false;
    }

    // Clear the error message when all fields are filled correctly
    signInEmail.classList.remove('neon');
    signInPassword.classList.remove('neon');
    incorrect.style.visibility = 'hidden';
    return true;
}

function clearInputsField() {
    signUpName.value = "";
    signUpEmail.value = "";
    signUpPassword.value = "";
    signInEmail.value = "";
    signInPassword.value = "";
}

signUpBtn.addEventListener('click', AddData);

loginBtn.addEventListener('click', RetData);

changePassword.addEventListener('click', UpdatePassword);
changeName.addEventListener('click', UpdateName);
deleteAccount.addEventListener('click', DeleteUser);


// C L O S E  P O P U P

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.visibility = 'hidden';
        popup.style.opacity = '0';
    }
}

// T O G G L E   M E N U
document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggle');

    // Toggle menu on button click
    toggleButton.addEventListener('click', function () {
        header.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideMenu = header.contains(event.target);
        const isClickOnToggleButton = toggleButton.contains(event.target);

        if (!isClickInsideMenu && !isClickOnToggleButton) {
            header.classList.remove('open');
        }
    });
});

// H I D E   P O P U P
hidePopup.forEach(element => {
    element.addEventListener('click', function () {
        header.classList.remove('open');
        passwordError.innerHTML = '';
        nameError.innerHTML = '';
        emailError.innerHTML = '';
    });
});

// T O A S T

let icon = { success: '<span class="material-symbols-outlined"><img class="check" src="../images/check.png" alt="check"></span>' };

const showToast = (
    message = "Sample Message",
    toastType = "info",
    duration = 5000) => {
    if (
        !Object.keys(icon).includes(toastType))
        toastType = "info";

    let box = document.createElement("div");
    box.classList.add(
        "toast", `toast-${toastType}`);
    box.innerHTML = ` <div class="toast-content-wrapper"> 
                      <div class="toast-icon"> 
                      ${icon[toastType]}
                      </div> 
                      <div class="toast-message">
                      ${message}
                      </div>`;
    duration = duration || 5000;

    let toastAlready =
        document.body.querySelector(".toast");
    if (toastAlready) {
        toastAlready.remove();
    }

    document.body.appendChild(box)
};

function clearPopupInputs() {
    existPasswordEmail.value = '';
    newPassword.value = '';
    existNameEmail.value = '';
    newName.value = '';
    existdeletEmail.value = '';
    passwordError.innerHTML = '';
    nameError.innerHTML = '';
    emailError.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', function () {
    const popups = document.querySelectorAll('#popup1, #popup2, #popup3');

    function showPopup(targetOverlay) {
        if (targetOverlay) {
            targetOverlay.style.visibility = 'visible';
            targetOverlay.style.opacity = '1';
        }
    }

    function hidePopup(targetOverlay) {
        if (targetOverlay) {
            targetOverlay.style.visibility = 'hidden';
            targetOverlay.style.opacity = '0';
        }
    }

    function closeAllPopups() {
        popups.forEach((popup) => hidePopup(popup));
    }

    document.querySelectorAll('#menu a').forEach((item) => {
        item.addEventListener('click', function () {
            const targetOverlayId = this.getAttribute('href').substring(1);
            const targetOverlay = document.getElementById(targetOverlayId);

            closeAllPopups();
            showPopup(targetOverlay);
        });
    });

    popups.forEach((popup) => {

        const content = popup.querySelector('.popup');
        const closeButtons = popup.querySelectorAll('.close');

        closeButtons.forEach((closeIcon) => {
            closeIcon.addEventListener('click', function () {
                hidePopup(popup);
                clearPopupInputs();
            });
        });

        popup.addEventListener('click', function (e) {
            const clickedElement = e.target;
            const isPopup = clickedElement === popup;

            if (isPopup && content) {
                content.classList.add('jely');
            }

            setTimeout(() => {
                content.classList.remove('jely');
            }, 500);
        });
    });
});
