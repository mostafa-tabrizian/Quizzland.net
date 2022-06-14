import React, { useEffect, useState } from "react";
import axiosInstance from '../components/axiosApi';;
import { message, Select } from 'antd';
import { Helmet } from "react-helmet";

import { log } from '../components/base'

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

    const checkIfLoggedIn = () => {
        if (
            localStorage.getItem('access_token') &&
            localStorage.getItem('refresh_token') &&
            localStorage.getItem('username') !== 'default'
        ) {
            window.location.href = '/'
        }
    }

    const handleSubmit = async () => {
        try {
            const data = await axiosInstance.post('api/token/obtain/', {
                username: username,
                password: password
            });

            await updateUserRefreshToken(username, data.data.refresh)

            axiosInstance.defaults.headers['Authorization'] = "JWT " + data.access;
            localStorage.setItem('username', username);
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

    const updateUserRefreshToken = async (username, newRefreshToken) => {
        const userId = await getUserId(username)
        await axiosInstance.patch(`/api/user/${userId}/`, {refresh_token: newRefreshToken})
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
                <div className="basicPage wrapper-sm m-auto absolute center top-20">
                    <h1 className="text-[3rem] mb-5 text-center text-[#ac272e] ">
                        ورود به کوییزلند
                    </h1>

                    <form className='grid justify-center space-y-5 p-8 w-[24rem] text-[20px] rounded-lg center'>
                        <label>
                            <input name="username" className='rounded-lg p-2 w-full' type="string" placeholder="نام کاربری" value={username} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setUsername(input.target.value)} />
                        </label>
                        <label>
                            <input name="password" className='rounded-lg p-2 w-full' type="password" placeholder="رمز عبور" value={password} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setPassword(input.target.value)} />
                        </label>
                        <button onClick={() => handleSubmit()} className='bg-[#ac272e] p-2 rounded-lg text-white font-semibold' type="button">
                            تایید
                        </button>
                    </form>
                </div>
            </div>

        </React.Fragment>
    );
}

export default Login;