import React, { useEffect, useState } from "react";
import { message, notification } from 'antd';
import { GoogleLogin, useGoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script'
// import ReCAPTCHA from 'react-google-recaptcha'
import { useCookies } from "react-cookie";

import axiosInstance from '../axiosApi';;
import { log, replaceFunction } from '../base'
import userProfileDetail from "./userProfileDetail";

const LoginForm = (props) => {
    // const [emailUsername, setEmailUsername] = useState(null)
    // const [password, setPassword] = useState(null)
    // const [reCaptchaResponse, setReCaptchaResponse] = useState(null)

    const [cookies, setCookie, removeCookie] = useCookies(['USER_ACCESS_TOKEN', 'USER_REFRESH_TOKEN']);

    const { signOut } = useGoogleLogout({
        clientId: '590155860234-tm0e6smarma5dvr7bi42v6r26v4qkdun.apps.googleusercontent.com',
        onLogoutSuccess: () => {log('google 1')},
        onFailure: () => {log('google 2')},
    })
    
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

    const logout = async () => {
        try {
            signOut()
        }
        catch (e) {
            log('signOut google error')
            log(e)
        }
        
        if (cookies.USER_REFRESH_TOKEN) {
            await axiosInstance.post('/api/blacklist/', {
                "refresh_token": cookies.USER_REFRESH_TOKEN,
            });
            
            removeCookie('USER_ACCESS_TOKEN')
            removeCookie('USER_REFRESH_TOKEN')
            
            axiosInstance.defaults.headers['Authorization'] = null;
            setTimeout(() => {
                window.location.reload()          
            }, 5000)
        }
    }

    const checkIfLoggedIn = async () => {
        const userProfile = await userProfileDetail()
        
        if (userProfile !== undefined && window.location.pathname == '/login') {
            window.location.href = '/'
        }
    }

    const showInActiveNotification = () => {
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
    }

    // const userNotActive = async (userDetail) => {
    //     if (!userDetail.is_active) {
    //         showInActiveNotification()
    //         return false
    //     } else {
    //         return true
    //     }
    // }

    // const checkAllInputEntered = () => {
    //     if (emailUsername == null || password == null) {
    //         message.warning('لطفا فورم را کامل کنید')
    //         return false
    //     } else {
    //         return true
    //     }
    // }

    // const doesUserExist = (fetchedUsers) => {
    //     if (fetchedUsers.length == 0) {
    //         message.error('این ایمیل/نام کاربری وجود ندارد');
    //         return false
    //     } else {
    //         return true
    //     }
    // }

    // const checkExistenceAndActivityStatue = async () => {
    //     const now = new Date().getTime()
        
    //     const existByEmail = await axiosInstance.get(`/api/userView/?email=${emailUsername}&timestamp=${now}`)
    //     const existByUsername = await axiosInstance.get(`/api/userView/?username=${emailUsername}&timestamp=${now}`)
        
    //     const fetchedUser = existByUsername.data.concat(existByEmail.data)
        
    //     if (doesUserExist(fetchedUser) && await userNotActive(fetchedUser[0])) { return true}
    //     else {return false}
    // }

    // const checkRecaptcha = async () => {
    //     if (reCaptchaResponse !== null) {
    //         return await axiosInstance.get(`/api/recaptcha?r=${reCaptchaResponse}`,)
    //             .then(res => {
    //                 return res.data
    //             })
    //             .catch(err => {
    //                 log(err.response)
    //             })
    //     } else {
    //         message.warning('لطفا تایید کنید که ربات نیستید!')
    //         return false 
    //     }
    // }

    // const handleSubmit = async () => {
    //     message.loading('لطفا منتظر بمانید ...', 1)
        
    //     if (
    //         checkAllInputEntered() &&
    //         await checkRecaptcha() &&
    //         await checkExistenceAndActivityStatue()
    //     ){
    //         try {
    //             const data = await axiosInstance.post('/api/token/obtain/', {
    //                 username: emailUsername,
    //                 password: password
    //             })
                    
    //             axiosInstance.defaults.headers['Authorization'] = "JWT " + data.data.access;
                
    //             setCookie('USER_ACCESS_TOKEN', data.data.access, { path: '/' });
    //             setCookie('USER_REFRESH_TOKEN', data.data.refresh, { path: '/' });

    //             window.location.reload()
    //             window.history.go(-1)
    
    //         } catch (error) {
    //             message.error('رمز عبور اشتباه می‌باشد');
    //             throw error;   
    //         }
    //     }
    // }

    // const keyboardClicked = (event) => {
    //     if (event.key === 'Enter') {
    //         handleSubmit()
    //     }
    // }

    const googleLoginSuccess = async (res) => {
        const userProfile = await userProfileDetail()
        
        if (userProfile == undefined) {
            const accessToken = res.accessToken
            const username = replaceFunction(res.profileObj.name, ' ', '')
            const email = res.profileObj.email
            const lastName = res.profileObj.familyName || ''
            const firstName = res.profileObj.givenName || ''
            const avatar = res.profileObj.imageUrl

            const payload = {
                accessToken: accessToken,
                username: username,
                email: email,
                lastName: lastName,
                firstName: firstName,
                avatar: avatar
            }
            
            accessToken &&
            await axiosInstance.post(`/api/google`, payload)
                .then(res => {
                    if (res.data == 'inactive') {
                        if ((cookies.USER_ACCESS_TOKEN == accessToken || cookies.USER_ACCESS_TOKEN == 'undefined')) {
                            showInActiveNotification()
                            logout()
                        }
                        return 
                    } else {
                        message.loading('در حال ورود ...', 1)
    
                        axiosInstance.defaults.headers['Authorization'] = "JWT " + res.data.access_token;
                        
                        setCookie('USER_ACCESS_TOKEN', res.data.access_token, { path: '/' });
                        setCookie('USER_REFRESH_TOKEN', res.data.refresh_token, { path: '/' });
        
                        window.location.reload()
                        if (window.location.pathname === '/login') {
                            window.history.go(-1)
                        }    
                    }
                    
                })
                .catch(err => {
                    log('get auth error')
                    log(err.response)
                })
        }
    }

    const googleLoginFailure = (res) => {
        message.error("ورود/ثبت نام شما به مشکل برخورد. لطفا دوباره تلاش کنید")
        log('fail login, res: ')
        log(res)
    }

    return (
        // <div className='p-8'>
        //     <form className='grid justify-center space-y-5 text-[20px] rounded-lg center'>
        //         <label className='w-[18rem]'>
        //             <input name="email" className='w-full p-2 text-base rounded-lg' type="string" placeholder="ایمیل یا نام کاربری" value={emailUsername} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setEmailUsername(input.target.value)} />
        //         </label>
        //         <label className='w-[18rem]'>
        //             <input name="password" className='w-full p-2 text-base rounded-lg' type="password" placeholder="رمز عبور" value={password} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setPassword(input.target.value)} />
        //         </label>
        //         <ReCAPTCHA
        //             sitekey="6LeoA0IbAAAAAEEqtkd4aCm-UceFee2uOi55vxaH"
        //             theme='dark'
        //             onChange={res => setReCaptchaResponse(res)}
        //         />
        //         <button onClick={() => handleSubmit()} className='bg-[#ac272e] p-2 rounded-lg text-white font-semibold' type="button">
        //             ورود
        //         </button>
        //     </form>

        //     <hr className='mx-auto' />

            <GoogleLogin
                clientId="590155860234-tm0e6smarma5dvr7bi42v6r26v4qkdun.apps.googleusercontent.com"
                className='ltr'  // w-[90%] flex justify-center
                buttonText="ورود/ثبت نام با حساب گوگل"
                onSuccess={googleLoginSuccess}
                onFailure={googleLoginFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
            
        // </div>
    );
}

export default LoginForm;