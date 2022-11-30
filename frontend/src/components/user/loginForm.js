import React, { useEffect, useState } from "react";
import { GoogleLogin, useGoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script'
import { useCookies } from "react-cookie";
import { useSnackbar } from 'notistack'
import {
    theme,
    eyesMap,
    eyebrowsMap,
    mouthsMap,
    hairMap,
    facialHairMap,
    clothingMap,
    accessoryMap,
    hatMap,
    bodyMap
} from "@bigheads/core";
import CircularProgress from '@mui/material/CircularProgress';
  
import axiosInstance from '../axiosAuthApi';;
import { log, replaceFunction } from '../base'
import UserStore from '../../store/userStore'
import axios from "axios";
import { Avatar } from "@mui/material";

const LoginForm = () => {
    const [loginLoading, setLoginLoading] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies(['USER_ACCESS_TOKEN', 'USER_REFRESH_TOKEN']);
    const [loginAvailable, setLoginAvailable] = useState(false)

    setTimeout(() => {
        setLoginAvailable(true)
    }, 3000);

    const [userProfile] = UserStore()
    
    const { enqueueSnackbar } = useSnackbar()

    const { signOut } = useGoogleLogout({
        clientId: process.env.GOOGLE_LOGIN_CLIENT,
        onLogoutSuccess: () => {log('signOut success');},
        onFailure: (err) => {
            log('signOut failure');
            // log(err)
        },
    })
    
    useEffect(() => {
        gapiLoad()
        filterThemes()
    }, [])

    useEffect(() => {
        checkIfLoggedIn()
    }, [userProfile]);

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
        log('logout')
        try {
            await axios.post('/api/blacklist/', {"refresh_token": cookies.USER_REFRESH_TOKEN,})
                .catch(err => {
                    log('err:logout')
                    // log(err)
                    // log(err.response)
                })
    
            removeCookie('USER_ACCESS_TOKEN', {path: '/'})
            removeCookie('USER_REFRESH_TOKEN', {path: '/'})
            
            axios.defaults.headers['Authorization'] = null;
            signOut()         
            window.location.reload()
        } catch (e) {
            log('logout error:')
            log(e)
        }
    };

    const checkIfLoggedIn = async () => {
        if (userProfile.userDetail && window.location.pathname == '/login') {
            window.location.href = '/'
        }
    }

    const showInActiveNotification = () => {
        enqueueSnackbar(
            <div className='mt-8'>
                <h5>این کاربر مسدود شده است</h5>
                <h5 className='mb-5'>
                    برای اطلاعات بیشتر با پشتیبانی کوییزلند در ارتباط باشید.
                </h5>
                <a className='underline' href="mailto:quizzland.net@gmail.com">ارسال ایمیل به پشتیبانی</a>
            </div>,
            { 
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
                autoHideDuration : 10_000,
                preventDuplicate: true
            }
        )
    }

    const selectRandomKey = (object) => {
        return Object.keys(object)[
          Math.floor(Math.random() * Object.keys(object).length)
        ];
    }

    const filterThemes = () => {
        // dress
        delete clothingMap.naked
    
        // hair
        delete facialHairMap.none2
        delete facialHairMap.none3
    
        // hat
        delete hatMap.none2
        delete hatMap.none3
        delete hatMap.none4
        delete hatMap.none5
    }

    const getRandomOptions = () => {
        const skinTone = selectRandomKey(theme.colors.skin);
        const eyes = selectRandomKey(eyesMap);
        const eyebrows = selectRandomKey(eyebrowsMap);;
        const mouth = selectRandomKey(mouthsMap);
        const hair = selectRandomKey(hairMap)
        const facialHair = selectRandomKey(facialHairMap)
        const clothing = selectRandomKey(clothingMap);
        const accessory = selectRandomKey(accessoryMap);
        const graphic = 'none';
        const hat = selectRandomKey(hatMap);
        const body = selectRandomKey(bodyMap);
        
        const hairColor = selectRandomKey(theme.colors.hair);
        const clothingColor = selectRandomKey(theme.colors.clothing);
        const circleColor = 'blue';
        const lipColor = selectRandomKey(theme.colors.lipColors);
        const hatColor = selectRandomKey(theme.colors.clothing);
        const faceMaskColor = selectRandomKey(theme.colors.clothing);
      
        const mask = true;
        const faceMask = false;
        const lashes = Math.random() > 0.5;
    
        const avatarRandomOption = {
          skinTone,
          eyes,
          eyebrows,
          mouth,
          hair,
          facialHair,
          clothing,
          accessory,
          graphic,
          hat,
          body,
          hairColor,
          clothingColor,
          circleColor,
          lipColor,
          hatColor,
          faceMaskColor,
          mask,
          faceMask,
          lashes
        }

        const stringifyAvatar = JSON.stringify(avatarRandomOption)
      
        return stringifyAvatar
    }

    const googleLoginSuccess = async (res) => {
        if (userProfile.userDetail == false || userProfile.userDetail == null) {
            const accessToken = res.accessToken
            const username = replaceFunction(res.profileObj.name, ' ', '')
            const email = res.profileObj.email
            const lastName = res.profileObj.familyName || ''
            const firstName = res.profileObj.givenName || ''
            const avatar = getRandomOptions()

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
                        enqueueSnackbar('در حال ورود ...', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
    
                        axiosInstance.defaults.headers['Authorization'] = "JWT " + res.data.access_token;
                        
                        setCookie('USER_ACCESS_TOKEN', res.data.access_token, { path: '/' });
                        setCookie('USER_REFRESH_TOKEN', res.data.refresh_token, { path: '/' });
        
                        document.location.reload()
                    }
                    
                })
                .catch(err => {
                    log('get auth error')
                    // log(err)
                    // log(err.response)
                })
        }
        setLoginLoading(false)
    }

    const googleLoginFailure = (res) => {
        setLoginLoading(false)

        if (res.details?.includes('Cookies')) {
            enqueueSnackbar('کوکی مرورگر شما غیرفعال است! برای ورود میبایست کوکی ها فعال باشند', { variant: 'error', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
        }
        else if (res?.target.id == 'google-login') {
            enqueueSnackbar('در اتصال شما به سرور های گوگل خطایی رخ داده است. لطفا پس از بررسی، مجددا تلاش کنید.', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
        }
        else {
            enqueueSnackbar('خطایی رخ داده است. لطفا مجددا تلاش کنید', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
            // log(res)
        }
    }

    const googleLoginRequest = () => {
        setLoginLoading(true)
    }

    return (
            <GoogleLogin
                clientId={process.env.GOOGLE_LOGIN_CLIENT}
                className='ltr'  // w-[90%] flex justify-center
                buttonText="ورود/ثبت نام با حساب گوگل"
                render={
                    props => 
                    <button onClick={() => props.onClick()} className={`px-6 py-1 h-fit bloodRiver_bg flex rounded-2xl text-white`}>
                        {
                            (loginLoading || !loginAvailable) ?
                            <CircularProgress
                                color="inherit"
                                size={27}
                                thickness={7} 
                            />
                            :
                            'ورود'
                        }
                        </button>
                }
                onSuccess={googleLoginSuccess}
                onFailure={googleLoginFailure}
                onRequest={googleLoginRequest}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
    );
}

export default LoginForm;