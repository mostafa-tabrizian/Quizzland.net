import React, { useEffect, useState } from "react";
import axiosInstance from '../../components/axiosApi';;
import { message } from 'antd';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha'

import { log } from '../../components/base'
import userProfileDetail from "../../components/userProfileDetail";

const pathRed = '/static/img/bubbles.webp'

const Register = () => {
    const [username, setUsername] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [rePassword, setRePassword] = useState(null)
    const [reCaptchaResponse, setReCaptchaResponse] = useState(null)

    useEffect(() => {
        checkIfLoggedIn()
        if (document.querySelector('body')) {
            document.querySelector('body').style = `background: #060101 url(${pathRed}) center center scroll !important`
        }
    }, [])

    const checkIfLoggedIn = async () => {
        const local_username = localStorage.getItem('username')
        const userProfile = await userProfileDetail()
        
        if (userProfile !== null && userProfile.username == local_username) {
            window.location.href = '/'
        }
    }

    const loginAndRedirect = async () => {
        const data = await axiosInstance.post('api/token/obtain/', {
            username: username,
            password: password
        });

        const passToken = `${new Date().getTime() * 85}${username}${(new Date().getTime() * 69) % 85}`
        await setUserPassToken(username, passToken)

        axiosInstance.defaults.headers['Authorization'] = "JWT " + data.access;
        localStorage.setItem('username', username);
        localStorage.setItem('pass_token', passToken);
        localStorage.setItem('access_token', data.data.access);
        localStorage.setItem('refresh_token', data.data.refresh);

        window.location.href = `/setting`
    }
    
    const validatePassword = () => {
        if (password.length < 8) { message.error('رمز عبور باید بیشتر از 8 کارکتر باشد')}
        else if (password == parseInt(password)) { message.error('رمز عبور باید حداقل حاوی یک کارکتر انگلیسی باشد')}
        else if (password !== rePassword) { message.error('رمز عبور و تکرار آن یکسان نمی‌باشد')}
        else { return 'valid'}
    }

    const emailExists = async () => {
        await axiosInstance.get(`/api/user/?email=${email}`)
            .then(user => {
                if (user.data.length == 0) { return false }
                else {
                    message.error('این ایمیل از قبل ثبت شده است!')
                }
            })
            .catch(err => {
                log(err.response)
            })
    }

    const checkAllInputEntered = () => {
        if (username == null || email == null || password == null || rePassword == null) {
            message.error('لطفا فورم را کامل کنید')
            return false
        } else {
            return true
        }
    }

    const handleSubmit = async () => {
        if (!checkAllInputEntered()) { return }
        if (await emailExists() || (validatePassword() !== 'valid') || !validateReCaptcha()) { return }

        await axiosInstance.post('api/user/', {
            username: username,
            email: email,
            password: password
        })
        .then(res => {
            switch(res.status) {
                case 201:
                    loginAndRedirect()
            }
        })
        .catch(err => {
            if (err.response.data.email) {
                message.error('ایمیل وارد شده معتبر نمی‌باشد!')
            }
            else if (err.response.data.username) {
                message.error('نام کاربری توسط شخص دیگری ثبت شده است. لطفا نام کاربری دیگری وارد کنید.')
            }
        })
    }

    const getUserId = async (username) => {
        return await axiosInstance.get(`/api/user/?username=${username}`)
            .then(res => {
                return res.data[0].id
            })
    }

    const setUserPassToken = async (username, newPassToken) => {
        const userId = await getUserId(username)
        await axiosInstance.patch(`/api/user/${userId}/`, {pass_token: newPassToken})
    }

    const keyboardClicked = (event) => {
        if (event.key === 'Enter') {
            handleSubmit()
        }
    }

    const validateReCaptcha = () => {
        if (reCaptchaResponse?.length !== 462) {
            message.error('ربات نبودن شما تایید نشد!')
            return false
        } else {
            return true
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>ثبت نام | ‌کوییزلند</title>
                {/* <meta name="description" content="تماس با پشتیبانی کوییزلند" />
                <meta name="keywords" content="پشتیبانی کوییزلند" /> */}
            </Helmet>

            <div className="center">
                <div className="absolute m-auto basicPage max-w-[33rem] center top-20">
                    <h1 className="text-[3rem] mb-5 text-center text-[#ac272e] ">
                        ثبت نام در کوییزلند
                    </h1>

                    <form className='grid justify-center space-y-5 p-8 text-[20px] rounded-lg center'>
                        <label className='w-[18rem]'>
                            <input name="username" className='w-full p-2 text-base rounded-lg' type="string" placeholder="نام کاربری" value={username} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setUsername(input.target.value)} />
                            <figcaption>نام کاربری به هیچ وجه قابل تغییر نمی‌باشد.</figcaption>
                        </label>
                        <label className='w-[18rem]'>
                            <input name="email" className='w-full p-2 text-base rounded-lg' type="email" placeholder="ایمیل" value={email} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setEmail(input.target.value)} />
                        </label>
                        <label className='w-[18rem]'>
                            <input name="password" className='w-full p-2 text-base rounded-lg' type="password" placeholder="رمز عبور" value={password} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setPassword(input.target.value)} />
                        </label>
                        <label className='w-[18rem]'>
                            <input name="rePassword" className='w-full p-2 text-base rounded-lg' type="password" placeholder="تکرار رمز عبور" value={rePassword} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setRePassword(input.target.value)} />
                        </label>
                        <ReCAPTCHA
                            sitekey="6LeoA0IbAAAAAEEqtkd4aCm-UceFee2uOi55vxaH"
                            theme='dark'
                            onChange={res => setReCaptchaResponse(res)}
                        />
                        <button onClick={() => handleSubmit()} className='bg-[#ac272e] p-2 rounded-lg text-white font-semibold' type="button">
                            ثبت نام
                        </button>
                    </form>

                    <div>
                        <h2>
                            یا اگر اکانت دارید اینجا <Link to='/login' className="text-[#d8545a] border-b">وارد</Link> شوید
                        </h2>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}

export default Register;