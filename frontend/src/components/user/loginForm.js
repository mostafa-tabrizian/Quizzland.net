import React, { useEffect, useState } from "react";
import axiosInstance from '../axiosApi';;
import { message, notification } from 'antd';
import { Link } from "react-router-dom";

import { log } from '../base'
import userProfileDetail from "./userProfileDetail";

const LoginForm = (props) => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)

    useEffect(() => {
        checkIfLoggedIn()
    }, [])

    const checkIfLoggedIn = async () => {
        const local_username = localStorage.getItem('username')
        const userProfile = await userProfileDetail()
        
        if (userProfile !== null && userProfile.username == local_username) {
            log('home')
            // window.location.href = '/'
        }
    }

    const checkIfBlocked = async () => {
        const now = new Date().getTime()
        
        return await axiosInstance.get(`api/user/?username=${username}&timestamp=${now}`)
            .then(res =>{
                return res.data[0].blocked
            })
            // .catch(err => {
            //     log(err.response1)
            // })
    }

    const handleSubmit = async () => {
        if (await checkIfBlocked()) {
            return notification.open({
                message: 'این نام کاربری مسدود شده است',
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
        
        try {
            const data = await axiosInstance.post('/api/token/obtain/', {
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

            window.location.reload()
            window.history.go(-1)

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
        <div className='noBlur'>
            <form className='grid noBlur justify-center space-y-5 p-8 text-[20px] rounded-lg center'>
                <label className='w-[18rem] noBlur'>
                    <input name="username" className='w-full p-2 text-base rounded-lg noBlur' type="string" placeholder="نام کاربری" value={username} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setUsername(input.target.value)} />
                </label>
                <label className='noBlur w-[18rem]'>
                    <input name="password" className='w-full p-2 text-base rounded-lg noBlur' type="password" placeholder="رمز عبور" value={password} onKeyDown={(event) => keyboardClicked(event)} onChange={(input) => setPassword(input.target.value)} />
                </label>
                <button onClick={() => handleSubmit()} className='bg-[#ac272e] noBlur p-2 rounded-lg text-white font-semibold' type="button">
                    تایید
                </button>
            </form>

            <div className='noBlur'>
                <h2 className='noBlur'>
                    یا اگر اکانت ندارید اینجا <Link to='/register' className="text-[#d8545a] noBlur">ثبت نام</Link> کنید
                </h2>
            </div>
        </div>
    );
}

export default LoginForm;