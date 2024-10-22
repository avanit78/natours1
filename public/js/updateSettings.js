import axios from 'axios';
import {showAlert} from './alerts';  

//type is either pass or data
export const updateSettings = async(data, type) => {
    try{
        // const url = type === 'password' ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword' : 'http://127.0.0.1:3000/api/v1/users/updateMe';
        const url = type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe';

        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if(res.data.status === 'success' && type === 'data'){
            showAlert('success',`${type.toUpperCase()} updated successfully`);
            window.setTimeout(()=>{
                location.assign('/me');
            },1000)
        }

        if(res.data.status === 'success' && type === 'password'){
            showAlert('success',`${type.toUpperCase()} updated successfully`);
        }
    }catch(err){
        showAlert('error',err.response.data.message);
    }
}