import '@babel/polyfill';
import {displayMap} from './mapbox';    
import {login,logout,forgotPassword,resetPass} from './login';
import {addReview, deleteReview} from './review';
import {addTour} from './addTour';
import {signUp} from './signUp';
import {updateSettings} from './updateSettings';
import {bookTour} from './stripe';

//Dom element
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const resetTokenForm = document.querySelector('.form--resetPassword');
const reviewForm = document.querySelector('.form--review');
const tourForm = document.querySelector('.form--tour');
const reviewDelete = document.querySelector('.form--delete');

    // Create a new URL object using the current URL
    const currentUrl = new URL(window.location.href);

    // Use URLSearchParams to get the query parameters
    const params = new URLSearchParams(currentUrl.search);

    // Get the value of the 'reviewIdwithName' parameter
    const reviewIdValue = params.get('reviewIdwithName');

const signUpForm = document.querySelector('.form--signUp');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const updatePassForm = document.querySelector('.form-user-password');
const forgotPass = document.querySelector('.forgot');
const bookBtn = document.getElementById('book-tour');

//delegation
if(mapbox){
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
    displayMap(locations);
}

if(loginForm)
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email,password)
});

if(resetTokenForm)
resetTokenForm.addEventListener('submit', e => {
    e.preventDefault();
    const token = document.getElementById('token').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    resetPass(token,password,passwordConfirm)
});

if(reviewForm)
reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const rating = document.querySelector('input[name="rating"]:checked').value;
    // const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;
    const tourId = document.getElementById('tourId').value;
    addReview(rating, review, tourId);
});

if(tourForm)
    tourForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const slug = document.getElementById('slug').value;
        const duration = document.getElementById('duration').value;
        const maxGroupSize = document.getElementById('maxGroupSize').value;
        const difficulty = document.getElementById('difficulty').value;
        const price = document.getElementById('price').value;
        const summary = document.getElementById('summary').value;
        const description = document.getElementById('description').value;
        const imageCover = document.getElementById('imageCover').value;
        const images = JSON.parse(document.getElementById('images').value);
        const startDates = JSON.parse(document.getElementById('startDates').value);
        const startLocation = JSON.parse(document.getElementById('startLocation').value);
        const locations = JSON.parse(document.getElementById('locations').value);
        const guides = JSON.parse(document.getElementById('guides').value);
        addTour(name, slug, duration, maxGroupSize, difficulty, price, summary, description, imageCover, images, startDates, startLocation, locations, guides );
    });

if(reviewIdValue) {reviewDelete.addEventListener('submit', deleteReview(reviewIdValue))};

if(signUpForm)
signUpForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signUp(name,email,password,passwordConfirm)
});

if(logoutBtn) logoutBtn.addEventListener('click', logout);

if(updateDataForm)
updateDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value)
    form.append('email', document.getElementById('email').value)
    form.append('photo', document.getElementById('photo').files[0])

    updateSettings(form, 'data')
});

if(updatePassForm)
updatePassForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...'

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({passwordCurrent, password, passwordConfirm}, 'password')

    document.querySelector('.btn--save-password').textContent = 'Save password'
    document.getElementById('password-current').value='';
    document.getElementById('password').value='';
    document.getElementById('password-confirm').value='';
});

if(forgotPass) forgotPass.addEventListener('click',e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    forgotPassword(email)
})

if(bookBtn){
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const {tourId} = e.target.dataset;
        bookTour(tourId);
    })
}