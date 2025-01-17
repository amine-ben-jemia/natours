// update Data
import '@babel/polyfill'
import axios from 'axios'
import { showAlert } from './alerts'


  // type is either 'password' or 'data'
  export const updateSettings = async (data,type) => {
    try {   
        
        const url = 
        type === 'password' 
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe'
    
        const res = await axios({
            method: 'PATCH',
            url,
            data
        })
        if(res.data.status === 'success'){
            
            showAlert('success',`${type.toUpperCase()} Updated succesfully !`)
            // window.setTimeout(()=>{
            //     location.assign('/me')
            // },1500)
        }
    }catch (err){
        showAlert('error',err.response.data.message)
        
    }
  }
