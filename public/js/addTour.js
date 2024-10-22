import axios from 'axios';
import {showAlert} from './alerts'; 

export const addTour = async(name, slug, duration, maxGroupSize, difficulty, price, summary, description, imageCover, images, startDates, startLocation, locations, guides ) => {
    // console.log(rating, review);
    try{
        const res = await axios({
            method: 'POST',
            // url: 'http://127.0.0.1:3000/api/v1/users/login',
            url: `/api/v1/tours`,
            data:{
                name, slug, duration, maxGroupSize, difficulty, price, summary, description, imageCover, images, startDates, startLocation, locations, guides 
            }
        });
        if(res.data.status === 'success'){
            showAlert('success','Tour Added');
            window.setTimeout(()=>{
                location.assign('/');
            },1000)
        }
    }catch(err){
        showAlert('error',err.response.data.message);
    }
}