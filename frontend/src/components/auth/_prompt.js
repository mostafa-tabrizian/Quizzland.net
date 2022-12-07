import React, { useEffect, useState, useRef } from "react";
// import { GoogleLogin, useGoogleLogout } from 'react-google-login';
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
import { log } from '../base'
import UserStore from '../../store/userStore'
import * as jose from 'jose'

const LoginPrompt = () => {
    const [loginLoading, setLoginLoading] = useState(false)
    const [loginAvailable, setLoginAvailable] = useState(false)
    
    const [cookies, setCookie, removeCookie] = useCookies(['USER_ACCESS_TOKEN', 'USER_REFRESH_TOKEN']);

    setTimeout(() => {
        setLoginAvailable(true)
    }, 3000);

    const [userProfile] = UserStore()
    
    const { enqueueSnackbar } = useSnackbar()
    
    useEffect(() => {
        filterThemes()
    }, [])

    useEffect(() => {
        checkIfLoggedIn()
    }, [userProfile]);

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

    const googleLogin = async (res) => {
        const JWT_Token = res.credential
        const profileDetail = jose.decodeJwt(JWT_Token)

        if (userProfile.userDetail == false && profileDetail.email_verified) {
            const payload = {
                accessToken: JWT_Token,
                username: profileDetail.name.replaceAll(' ', ''),
                email: profileDetail.email,
                lastName: profileDetail.family_name || '',
                firstName: profileDetail.given_name || '',
                avatar: getRandomOptions()
            }

            await axiosInstance.post(`/auth`, payload)
                .then(res => {
                    if (res.data == 'inactive') {
                        showInActiveNotification()
                    } else {
                        axiosInstance.defaults.headers['Authorization'] = "JWT " + res.data.access_token;
                        
                        setCookie('USER_ACCESS_TOKEN', res.data.access_token, { path: '/' });
                        setCookie('USER_REFRESH_TOKEN', res.data.refresh_token, { path: '/' });
                            
                        enqueueSnackbar('در حال ورود ...', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                        document.location.reload()
                    }
                    
                })
                .catch(err => {
                    log('get auth error')
                    log(err)
                    log(err.response)
                })
        }
        setLoginLoading(false)
    }

    window.onload = () => {
        google.accounts.id.initialize({
            client_id: process.env.GOOGLE_LOGIN_CLIENT,
            callback: googleLogin
        });
        log('google')
        google.accounts.id.prompt(); // also display the One Tap dialog
    }

    return ('')
}

export default LoginPrompt;