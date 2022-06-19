import React, { useEffect, useState } from "react";
import axiosInstance from '../components/axiosApi';;
import { message } from 'antd';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import { log } from '../components/base'
import userProfileDetail from "../components/userProfileDetail";

const pathRed = '/static/img/bubbles.png'

const Login = () => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)

    useEffect(() => {
        checkIfLoggedIn()
        if (document.getElementById('html')) {
            document.getElementById('html').style = `background: #0a0d13 url(${pathRed}) center center scroll !important`
        }
    }, [])

    const checkIfLoggedIn = async () => {
        const local_username = localStorage.getItem('username')
        const userProfile = await userProfileDetail()
        if (userProfile !== null && userProfile.username == local_username) {
            window.location.href = '/'
        }
    }

    const handleSubmit = async () => {
        try {
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

            window.location.href = '/'

        } catch (error) {
            message.error('نام کاربری یا رمز عبور اشتباه می‌باشد');
            throw error;
        }
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
                <title>ورود | ‌کوییزلند</title>
                {/* <meta name="description" content="تماس با پشتیبانی کوییزلند" />
                <meta name="keywords" content="پشتیبانی کوییزلند" /> */}
            </Helmet>

            <div className="center">
                <div className="absolute m-auto basicPage wrapper-sm center top-20">
                    <h1 className="text-[3rem] mb-5 text-center text-[#ac272e] ">
                        ورود به کوییزلند
                    </h1>

                    <form className='grid justify-center space-y-5 p-8 text-[20px] rounded-lg center'>
                        <label className='w-[18rem]'>
                            <input name="username" className='w-full p-2 text-base rounded-lg' type="string" placeholder="نام کاربری" value={username} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setUsername(input.target.value)} />
                        </label>
                        <label className='w-[18rem]'>
                            <input name="password" className='w-full p-2 text-base rounded-lg' type="password" placeholder="رمز عبور" value={password} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setPassword(input.target.value)} />
                        </label>
                        <button onClick={() => handleSubmit()} className='bg-[#ac272e] p-2 rounded-lg text-white font-semibold' type="button">
                            تایید
                        </button>
                    </form>

                    <div>
                        <h2>
                            یا اگر اکانت ندارید اینجا <Link to='/register' className="text-[#d8545a]">ثبت نام</Link> کنید
                        </h2>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}

export default Login;