import React, { useEffect, useState } from "react";
import axiosInstance from '../axiosApi';;
import { message, notification } from 'antd';
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
        checkIfLoggedIn()

        const startGapiClient = () => {
            gapi.client.init({
                clientId: process.env.GOOGLE_LOGIN_CLIENT,
                scope: ''
            })
        }

        gapi.load('client:auth2', startGapiClient)
    }, [])

    const checkIfLoggedIn = async () => {
        const userProfile = await userProfileDetail()
        
        if (userProfile !== undefined && window.location.pathname == '/login') {
            window.location.href = '/'
        }
    }

    const userNotActive = async (userDetail) => {
        if (!userDetail.is_active) {
            notification.open({
                message: 'این کاربر مسدود شده است',
                description:
                    'برای اطلاعات بیشتر با پشتیبانی کوییزلند تماس بگیرید quizzland.net@gmail.com',
                duration: 5,
                style: {
                    'font-size': '25px',
                    'font-weight': '600',
                    'box-shadow': '0 0 20px #b52633',
                    'direction': 'rtl',
                    'padding-right': '4rem',
                },
                className: 'rounded-lg'
            });

            return false
        } else {
            return true
        }
    }

    const checkAllInputEntered = () => {
        if (emailUsername == null || password == null) {
            message.warning('لطفا فورم را کامل کنید')
            return false
        } else {
            return true
        }
    }

    const doesUserExist = (fetchedUsers) => {
        if (fetchedUsers.length == 0) {
            message.error('این ایمیل/نام کاربری وجود ندارد');
            return false
        } else {
            return true
        }
    }

    const checkExistenceAndActivityStatue = async () => {
        const now = new Date().getTime()
        
        const existByEmail = await axiosInstance.get(`/api/user/?email=${emailUsername}&timestamp=${now}`)
        const existByUsername = await axiosInstance.get(`/api/user/?username=${emailUsername}&timestamp=${now}`)
        
        const fetchedUser = existByUsername.data.concat(existByEmail.data)
        
        if (doesUserExist(fetchedUser) && await userNotActive(fetchedUser[0])) { return true}
        else {return false}
    }

    const checkRecaptcha = () => {
        log(reCaptchaResponse)
        log(reCaptchaResponse.length)
        if (reCaptchaResponse !== null && reCaptchaResponse.length == 462) {
            return true
        } else {
            message.warning('لطفا تایید کنید که ربات نیستید!')
            return false 
        }
    }

    const handleSubmit = async () => {
        if (
            checkAllInputEntered() &&
            checkRecaptcha() &&
            await checkExistenceAndActivityStatue()
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
        const userProfile = await userProfileDetail()
        
        if (userProfile == undefined) {
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
                    if (window.location.pathname === '/login') {
                        window.history.go(-1)
                    }
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
        <div className='p-8'>
            <form className='grid justify-center space-y-5 text-[20px] rounded-lg center'>
                <label className='w-[18rem]'>
                    <input name="email" className='w-full p-2 text-base rounded-lg' type="string" placeholder="ایمیل یا نام کاربری" value={emailUsername} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setEmailUsername(input.target.value)} />
                </label>
                <label className='w-[18rem]'>
                    <input name="password" className='w-full p-2 text-base rounded-lg' type="password" placeholder="رمز عبور" value={password} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setPassword(input.target.value)} />
                </label>
                <ReCAPTCHA
                    sitekey="6LeoA0IbAAAAAEEqtkd4aCm-UceFee2uOi55vxaH"
                    theme='dark'
                    onChange={res => setReCaptchaResponse(res)}
                />
                <button onClick={() => handleSubmit()} className='bg-[#ac272e] p-2 rounded-lg text-white font-semibold' type="button">
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