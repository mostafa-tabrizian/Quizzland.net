import React, { useEffect } from "react";
import { message, notification } from 'antd';
import { GoogleLogin, useGoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script'
import { useCookies } from "react-cookie";

import axiosInstance from '../axiosApi';;
import { log, replaceFunction } from '../base'
import UserCart from '../../store/userStore'
import axios from "axios";

const LoginForm = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['USER_ACCESS_TOKEN', 'USER_REFRESH_TOKEN']);

    const [userProfile, userActions] = UserCart()

    const { signOut } = useGoogleLogout({
        clientId: process.env.GOOGLE_LOGIN_CLIENT,
        onLogoutSuccess: () => {log('google 1')},
        onFailure: () => {log('google 2')},
    })
    
    useEffect(() => {
        gapiLoad()
    }, [])

    // useEffect(() => {
    //     checkIfLoggedIn()
    // }, [userProfile]);

    const gapiLoad = () => {
        const startGapiClient = () => {
            gapi.client.init({
                clientId: process.env.GOOGLE_LOGIN_CLIENT,
                scope: ''
            })
        }

        gapi.load('client:auth2', startGapiClient)
    }

    const logout = async () => {
        return log('logout')
        try {
            await axios.post('/api/blacklist/', {"refresh_token": cookies.USER_REFRESH_TOKEN,})
                .then(res => {
                    removeCookie('USER_ACCESS_TOKEN', {path: '/'})
                    removeCookie('USER_REFRESH_TOKEN', {path: '/'})
                    
                    axios.defaults.headers['Authorization'] = null;
                    signOut()         
                    // window.location.reload()
                })
                .catch(err => {
                    // window.location.href = '/'
                })
        }
        catch (e) {
            console.log(e);
        }
    };

    const checkIfLoggedIn = async () => {
        if (userProfile.userDetail) {
            log('loggedIn')
            return log(userProfile)
            // window.location.href = '/'
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

    const googleLoginSuccess = async (res) => {
        // if (userProfile.userDetail == false) {
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
                        showInActiveNotification()
                        if ((cookies.USER_ACCESS_TOKEN == accessToken || cookies.USER_ACCESS_TOKEN == 'undefined')) {
                            logout()
                        }
                        return 
                    } else {
                        message.loading('در حال ورود ...', 1)
    
                        axiosInstance.defaults.headers['Authorization'] = "JWT " + res.data.access_token;
                        
                        setCookie('USER_ACCESS_TOKEN', res.data.access_token, { path: '/' });
                        setCookie('USER_REFRESH_TOKEN', res.data.refresh_token, { path: '/' });
        
                        document.location.reload()
                        if (window.location.pathname === '/login') {
                            window.history.go(-1)
                        }    
                    }
                    
                })
                .catch(err => {
                    log('get auth error')
                    log(err)
                    log(err.response)
                })
        // }
    }

    const googleLoginFailure = (res) => {
        message.error("ورود/ثبت نام شما به مشکل برخورد. لطفا دوباره تلاش کنید")
        log('fail login, res: ')
        log(res)
    }

    return (
            <GoogleLogin
                clientId={process.env.GOOGLE_LOGIN_CLIENT}
                className='ltr'  // w-[90%] flex justify-center
                buttonText="ورود/ثبت نام با حساب گوگل"
                onSuccess={googleLoginSuccess}
                onFailure={googleLoginFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
    );
}

export default LoginForm;