import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";
function RegisterComponent(){
    const navigate = useNavigate();
    const [email,setEmail] = useState('');
    const [name,setName] = useState('');
    const [password,setPassword]= useState('');

    const register = async (e) => {
        e.preventDefault();
       let model = {
           email:email,
           name:name,
           password:password
       }
        console.log('register page')
       try {
        const response = await axios.post('http://localhost:5000/auth/register',model)
        localStorage.setItem('token',response.data.token)
           localStorage.setItem('user',JSON.stringify(response.data.user))
           navigate('/');
       } catch (error) {
        console.log(error)
       }

    }

    return(
        <>
            <div className='d-flex justify-content-center mt-5'>
                <div className='col-md-5'>
                    <div className='card '>
                        <div className='card-header'>
                            <h1> Kayıt Sayfası </h1>
                        </div>
                        <div className='card-body'>
                            <form onSubmit={register}>
                                <div className='form-group'>
                                    <label htmlFor='name'>Kullanıcı Adı</label>
                                    <input value={name} onChange={(e)=> setName(e.target.value)} type='text' className='form-control' id='name' name='name' />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='email'>Mail Adresi</label>
                                    <input value={email} onChange={(e)=> setEmail(e.target.value)} type='email' className='form-control' id='email' name='email' />
                                </div>
                                <div className='form-group mt-2'>
                                    <label htmlFor='password'>Şifre</label>
                                    <input value={password} onChange={(e)=> setPassword(e.target.value)} type='password' className='form-control' id='password' name='password' />
                                </div>
                                <div className='form-group mt-2'>
                                    <button className='btn btn-outline-success w-100'>
                                       Kayıt Ol
                                    </button>
                                    <Link to='/login' className='mt-2' style={{float:"right"}}>Giriş Sayfası</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterComponent