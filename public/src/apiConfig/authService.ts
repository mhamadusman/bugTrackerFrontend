
import {api} from '../apiConfig/api'
import { signup  , loginDetails} from '../components/types/types';

export class AuthSrvice {

  static async signup(userData: signup) {
    const  {confirmPassword , ...dataTosend} = userData
    console.log(dataTosend.userType)
    const response = await api.post("/auth/sign-up", dataTosend);
    console.log("Signup Success:", response.data);

  }


  static async  login(data: loginDetails){

      const response = await api.post('/auth/login' , data)
      localStorage.setItem('role' , response.data.userType)
      return true 
  }

}