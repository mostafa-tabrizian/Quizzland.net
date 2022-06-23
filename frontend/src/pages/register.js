import React, { useEffect, useState } from "react";
import axiosInstance from '../components/axiosApi';;
import { message } from 'antd';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import { log } from '../components/base'
import userProfileDetail from "../components/userProfileDetail";

const pathRed = '/static/img/bubbles.webp'

const Register = () => {
    const [username, setUsername] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

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

    const postUserInformations = async () => {
        await axiosInstance.post('api/user/')
    }

    // const loginAndRedirect = async () => {
    //     const data = await axiosInstance.post('api/token/obtain/', {
    //         username: username,
    //         password: password
    //     });

    //     const passToken = `${new Date().getTime() * 85}${username}${(new Date().getTime() * 69) % 85}`
    //     await setUserPassToken(username, passToken)

    //     axiosInstance.defaults.headers['Authorization'] = "JWT " + data.access;
    //     localStorage.setItem('username', username);
    //     localStorage.setItem('pass_token', passToken);
    //     localStorage.setItem('access_token', data.data.access);
    //     localStorage.setItem('refresh_token', data.data.refresh);

    //     window.location.href = `/profile/${username}`
    // }

    const handleSubmit = async () => {
        await axiosInstance.post('api/user/', {
            username: username,
            email: email,
            password: password
        })
        .then(res => {
            switch(res.status) {
                case 201:
                    // loginAndRedirect()
                    window.location.href = `/setPassword?u=${username}&p=${password}`
            }
        })
        .catch(err => {
            if (err.response.data.email) {
                message.error('ایمیل شما معتبر نمی‌باشد!')
            }
            else if (err.response.data.username) {
                message.error('نام کاربری از قبل وجود دارد. لطفا نام کاربری دیگری انتخاب کنید.')
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
                        </label>
                        <label className='w-[18rem]'>
                            <input name="email" className='w-full p-2 text-base rounded-lg' type="email" placeholder="ایمیل" value={email} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setEmail(input.target.value)} />
                        </label>
                        <label className='w-[18rem]'>
                            <input name="password" className='w-full p-2 text-base rounded-lg' type="password" placeholder="رمز عبور" value={password} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setPassword(input.target.value)} />
                        </label>
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