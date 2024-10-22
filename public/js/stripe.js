import axios from 'axios';
import {showAlert} from './alerts';   

// const { default: Stripe } = require("stripe");
const stripe = Stripe('pk_test_51PiqYJSEYzaZJ0DAuOQ3TFOej1rvsrIBESxQnqr3J096XkplYIM85UEExoIwv5x25GfRkPFNW62I0jwPvUDpl2IA00xoAW4psX')

export const bookTour = async (tourId) => {
    try {
        // 1) Get checkout session from API
        // const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        // console.log('Checkout session:', session);
        // console.log('session Id:', session.data.session.id);

        // 2) Redirect to Stripe Checkout
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.error('Error booking tour:', err);
        showAlert('error', err);
    }
};