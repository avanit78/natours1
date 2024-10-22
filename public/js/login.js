import axios from 'axios';
import {showAlert} from './alerts';   

export const login = async(email,password) => {
    try{
        const res = await axios({
            method: 'POST',
            // url: 'http://127.0.0.1:3000/api/v1/users/login',
            url: '/api/v1/users/login',
            data:{
                email: email,
                password
            }
        });

        if(res.data.status === 'success'){
            showAlert('success','Logged in successfully');
            window.setTimeout(()=>{
                location.assign('/');
            },1000)
        }

    }catch(err){
        showAlert('error',err.response.data.message);
    }
}

export const logout = async() => {
    try{
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
            // url: 'http://127.0.0.1:3000/api/v1/users/logout'
        });
        if((res.data.status = 'success')) {
            showAlert('success','Logout successfully');
            window.setTimeout(()=>{
                location.assign('/');
            },2000)  //location.reload(true) we can use
        };
    }catch(err){
        showAlert('error','Error logging out! Try again');
    }
} 

export const forgotPassword = async(email) => {
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/forgotPassword',
            data: {
                email
            }
        });
        if((res.data.status = 'success')) {
            showAlert('success',res.data.message);
            window.setTimeout(()=>{
                location.assign('/resetPassword');
            },3000)  //location.reload(true) we can use
        };
    }catch(err){
        showAlert('error',err.response.data.message);
    }
} 

export const resetPass = async(token,password,passwordConfirm) => {
    try{
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/users/resetPassword/${token}`,
            data: {
                password,
                passwordConfirm
            }
        });
        if((res.data.status = 'success')) {
            showAlert('success',"Password Reset successfully");
            window.setTimeout(()=>{
                location.assign('/');
            },500)  //location.reload(true) we can use
        };
    }catch(err){
        showAlert('error',err.response.data.message);
    }
} 

