import React, { useEffect, useState } from "react";
import axiosInstance from '../axiosApi';;
import { message } from 'antd';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script'
import ReCAPTCHA from 'react-google-recaptcha'

import { log, replaceFunction } from '../base'
import userProfileDetail from "./userProfileDetail";

const LoginForm = (props) => {
    const [emailUsername, setEmailUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [reCaptchaResponse, setReCaptchaResponse] = useState(null)

    useEffect( async () => {
        checkIfLoggedIn(false)

        const startGapiClient = () => {
            gapi.client.init({
                clientId: '590155860234-tm0e6smarma5dvr7bi42v6r26v4qkdun.apps.googleusercontent.com',
                scope: ''
            })
        }

        gapi.load('client:auth2', startGapiClient)
    }, [])

    const checkIfLoggedIn = async (googleLoginStatus) => {
        const userProfile = await userProfileDetail()
        
        if ((userProfile !== undefined && window.location.pathname == '/login') || googleLoginStatus) {
            window.location.href = '/'
        }
    }

    // const checkIfBlocked = async () => {
    //     const now = new Date().getTime()
        
    //     return await axiosInstance.get(`api/user/?email=${email}&timestamp=${now}`)
    //         .then(res =>{
    //             if (res.data[0].blocked) {
    //                 notification.open({
    //                     message: 'این کاربر مسدود شده است',
    //                     description:
    //                         'برای اطلاعات بیشتر با پشتیبانی کوییزلند تماس بگیرید quizzland.net@gmail.com',
    //                     duration: 5,
    //                     style: {
    //                         'font-size': '25px',
    //                         'font-weight': '600',
    //                         'box-shadow': '0 0 20px #b52633',
    //                         'direction': 'rtl',
    //                         'padding-right': '4rem',
    //                     },
    //                     className: 'rounded-lg'
    //                 });

    //                 return false
    //             } else {
    //                 return true
    //             }
    //         })
    //         .catch(err => {
    //             log(err.response)
    //         })
    // }

    const checkAllInputEntered = () => {
        if (emailUsername == null || password == null) {
            message.warning('لطفا فورم را کامل کنید')
            return false
        } else {
            return true
        }
    }

    const doesUserExist = async () => {
        const now = new Date().getTime()
        
        const existByEmail = await axiosInstance.get(`/api/user/?email=${emailUsername}&timestamp=${now}`)
        const existByUsername = await axiosInstance.get(`/api/user/?username=${emailUsername}&timestamp=${now}`)
        
        const doesUserExist = existByUsername.data.concat(existByEmail.data).length !== 0
        
        if (doesUserExist) { return true}
        else {
            message.error('این ایمیل/نام کاربری وجود ندارد');
            return false
        }
    }

    const handleSubmit = async () => {
        if (
            checkAllInputEntered() &&
            await doesUserExist()
        ){
            // reCaptchaResponse
              
            try {
                const data = await axiosInstance.post('/api/token/obtain/', {
                    username: emailUsername,
                    password: password
                })
                    
                axiosInstance.defaults.headers['Authorization'] = "JWT " + data.data.access;
                sessionStorage.setItem('access_token', data.data.access);
                sessionStorage.setItem('refresh_token', data.data.refresh);
                
                window.location.reload()
                window.history.go(-1)
    
            } catch (error) {
                message.error('رمز عبور اشتباه می‌باشد');
                throw error;   
            }
        }
    }

    const keyboardClicked = (event) => {
        if (event.key === 'Enter') {
            handleSubmit()
        }
    }

    const googleLoginSuccess = async (res) => {
        if (window.location.pathname === '/login') {
            const accessToken = res.accessToken
            const username = replaceFunction(res.profileObj.name, ' ', '')
            const email = res.profileObj.email
            const lastName = res.profileObj.familyName || ''
            const firstName = res.profileObj.givenName || ''
            const avatar = res.profileObj.imageUrl

            accessToken &&
            await axiosInstance.get(`/api/google?at=${accessToken}&u=${username}&e=${email}&ln=${lastName}&fn=${firstName}&av=${avatar}`)
                .then(res => {
                    axiosInstance.defaults.headers['Authorization'] = "JWT " + res.data.access_token;
                    sessionStorage.setItem('access_token', res.data.access_token);
                    sessionStorage.setItem('refresh_token', res.data.refresh_token);

                    window.location.reload()
                    window.history.go(-1)
                })
                .catch(err => {
                    log(err.response)
                })
        }
    }

    const googleLoginFailure = (res) => {
        log('fail login, res: ' + res)
    }

    return (
        <div className='p-8 noBlur '>
            <form className='grid noBlur justify-center space-y-5 text-[20px] rounded-lg center'>
                <label className='w-[18rem] noBlur'>
                    <input name="email" className='w-full p-2 text-base rounded-lg noBlur' type="string" placeholder="ایمیل یا نام کاربری" value={emailUsername} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setEmailUsername(input.target.value)} />
                </label>
                <label className='noBlur w-[18rem]'>
                    <input name="password" className='w-full p-2 text-base rounded-lg noBlur' type="password" placeholder="رمز عبور" value={password} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setPassword(input.target.value)} />
                </label>
                <ReCAPTCHA
                    sitekey="6LeoA0IbAAAAAEEqtkd4aCm-UceFee2uOi55vxaH"
                    theme='dark'
                    onChange={res => setReCaptchaResponse(res)}
                />
                <button onClick={() => handleSubmit()} className='bg-[#ac272e] noBlur p-2 rounded-lg text-white font-semibold' type="button">
                    ورود
                </button>
            </form>

            <hr className='mx-auto' />

            <GoogleLogin
                clientId="590155860234-tm0e6smarma5dvr7bi42v6r26v4qkdun.apps.googleusercontent.com"
                className='w-[90%] flex justify-center'
                buttonText="ورود با حساب گوگل"
                onSuccess={googleLoginSuccess}
                onFailure={googleLoginFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
            
        </div>
    );
}

export default LoginForm;