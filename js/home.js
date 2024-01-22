// L O G O U T

var logOut = document.getElementById('logOut');
var userName = document.getElementById('userName');
var sessionUser = localStorage.getItem('sessionUsername');

if (sessionUser) {
    var firstWord = sessionUser.split(' ')[0];
    userName.innerHTML = `<span class="anim-bg">${firstWord}</span>`;
}

// S O C I A L

var main = document.querySelector('.main');
var cards = document.querySelectorAll('.card');

function toggleMenu() {
    main.classList.toggle('active');

    cards.forEach(function (card) {
        card.style.pointerEvents = main.classList.contains('active') ? 'auto' : 'none';
    });
}

main.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleMenu();
});

document.body.addEventListener('click', function () {
    if (main.classList.contains('active')) {
        toggleMenu();
    }
});


// B O O K

var link = document.getElementById('on');
var cover = document.getElementById('cover');
var bookPage = document.querySelector('.book');
var cardFront = document.getElementById('cardFront');
var frontText = document.getElementById('frontText');

link.addEventListener('click', function () {
    cover.classList.add('show');
});

cover.addEventListener('click', function (e) {
    if (!bookPage.contains(e.target)) {
        cover.classList.remove('show');
    }
});

bookPage.addEventListener('click', function () {
    toggleBookPage();
});

function toggleBookPage() {
    if (bookPage.classList.contains('flipped')) {
        bookPage.classList.remove('flipped');
        cardFront.style.transform = 'rotateY(0deg)';

        setTimeout(() => {
            frontText.style.display = 'block';
        }, 100);
    }
    else {
        bookPage.classList.add('flipped');
        cardFront.style.transform = 'rotateY(-160deg)';

        setTimeout(() => {
            frontText.style.display = 'none';
        }, 100);
    }
}

// L I K E ( F I R E B A S E)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAOjinb4OOLrlr1y1MTkF7w08exkYp6cPM",
    authDomain: "login-system7.firebaseapp.com",
    projectId: "login-system7",
    storageBucket: "login-system7.appspot.com",
    messagingSenderId: "1061721003230",
    appId: "1:1061721003230:web:d277760a8cacf99a5e9e4f"
};

const app = initializeApp(firebaseConfig);
const fireStore = getFirestore(app);
const auth = getAuth();

var like = document.getElementById('like');
let totalLikeCount;
let userLikeDocRef;
let isLiked = false;

const totalLikesDocRef = doc(fireStore, 'likeData', 'totalLikes');

getDoc(totalLikesDocRef)
    .then((docSnapshot) => {
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            totalLikeCount = data.totalLikeCount || 214;
        } else {
            totalLikeCount = 214;
            setDoc(totalLikesDocRef, { totalLikeCount });
        }

        userLikeDocRef = doc(fireStore, 'likeData', sessionUser || auth.currentUser.displayName);

        getDoc(userLikeDocRef).then((userDocSnapshot) => {
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                isLiked = userData.isLiked || false;
            }

            updateLikeDisplay();
        });
    });

function updateLikeDisplay() {
    const likeCountElement = document.getElementById('likeCount');
    like.classList.toggle('liked', isLiked);

    likeCountElement.textContent = totalLikeCount;
}

async function toggleLike() {
    const likeChange = isLiked ? -1 : 1;

    isLiked = !isLiked;

    totalLikeCount = totalLikeCount + likeChange;

    like.classList.add('beat');

    await updateDoc(totalLikesDocRef, { totalLikeCount });

    await setDoc(userLikeDocRef, { isLiked, lastUpdated: serverTimestamp() }, { merge: true });

    like.classList.remove('beat');

    updateLikeDisplay();
}

like.addEventListener('click', toggleLike);


// S I G N  O U T

const SignOutGoogle = async () => {
    await signOut(auth);
};

logOut.addEventListener('click', function () {
    if (auth.currentUser) {
        SignOutGoogle();
    } else if (sessionUser) {
        localStorage.removeItem('sessionUsername');
    }
    window.location.assign('index.html');
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        var firstWord = user.displayName.split(' ')[0];
        userName.innerHTML = `<span class="anim-bg">${firstWord}</span>`;
    }
});


// C L O C K

function date_time(id) {
    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var day = date.getDay();

    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;

    if (h < 10) {
        h = "0" + h;
    }

    if (m < 10) {
        m = "0" + m;
    }

    var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var dayName = daysOfWeek[day];

    document.getElementById("d").innerHTML = dayName;
    document.getElementById("m").innerHTML = '' + m;
    document.getElementById("h").innerHTML = '' + h;
    document.getElementById("ampm").innerHTML = ampm;

    setTimeout(function () {
        date_time(id + 1);
    }, 1000);

    return true;
}

window.onload = function () {
    date_time(0);
};