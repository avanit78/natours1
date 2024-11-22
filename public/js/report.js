import axios from 'axios';
import {showAlert} from './alerts';

export const report = async (startDate, endDate) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/bookings/reportTour',
            data: {
                startDate,
                endDate
            }
        });

        let a = res.data.data.bookings;
        let b = res.data.data.tours;
        let c = res.data.data.users;

        // Redirect to viewreports and pass data as query params or in the body
        if (res.data.status === 'success') {
            window.setTimeout(() => {
                // Pass data as query params or use a POST request to send the data
                const queryParams = new URLSearchParams({
                    bookings: JSON.stringify(a),
                    tours: JSON.stringify(b),
                    users: JSON.stringify(c)
                }).toString();
                
                location.assign(`/viewreports?${queryParams}`);
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};


