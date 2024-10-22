import axios from 'axios';
import {showAlert} from './alerts'; 

export const addReview = async(rating, review,tourId) => {
    // console.log(rating, review);
    try{
        const res = await axios({
            method: 'POST',
            // url: 'http://127.0.0.1:3000/api/v1/users/login',
            url: `/api/v1/reviews/${tourId}`,
            data:{
                rating,
                review
            }
        });
        if(res.data.status === 'success'){
            showAlert('success','Review submit');
            window.setTimeout(()=>{
                location.assign('/my-reviews');
            },1000)
        }
    }catch(err){
        showAlert('error',err.response.data.message);
    }
}

export const deleteReview = async (reviewId) => {
    // console.log('deleteReview called with reviewId:', reviewId); // Check if the function is called
    try {
        const res = await axios({
            method: 'DELETE',
            url: `/api/v1/reviews/${reviewId}`
        });
        const status = 'success';
        // console.log('Response from API:',res.data); // Check the response
        
        if (status === 'success') {
            showAlert('success', 'Review deleted');
            window.setTimeout(() => {
                location.assign('/my-reviews');
            }, 1000);
        }
    } catch (err) {
        console.error(err); // Log the error
        showAlert('error', err.response.data.message);
    }
};

