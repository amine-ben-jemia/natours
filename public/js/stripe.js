import axios from 'axios'
import { showAlert } from './alerts'
const stripe = Stripe('pk_test_51Ho8miIeuSnbE8G7VcQDkXeV0DZ9lV5EgEurcyz0tEnfXuNCeWffHyLmCfCasMLWoAEeB4ZoVt7McXh3mjuMf1B200RmMJVp1a')

export const bookTour = async tourId =>{
    try{
        // 1) Get checkout session from API
        const session = await axios(
        `/api/v1/bookings/checkout-session/${tourId}`
        )
        // 2) Create Checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })

    }catch(err){
        showAlert('error',err)
    }

}