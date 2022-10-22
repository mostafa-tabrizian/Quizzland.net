import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import { log, getTheme } from '../../components/base'
const LoginForm = React.lazy(() => import("../../components/user/loginForm"))

const pathRed = '/static/img/bubbles.webp'

const Login = () => {
    const [theme, setTheme] = useState('dark')    
    
    useEffect(() => {
        document.querySelector('header')?.remove()
        const theme = getTheme()
        setTheme(theme)
        // document.querySelector('body').style = `background: ${theme == 'light' ? 'white' : '#060101'} url(${pathRed}) center center scroll`
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #781a23) url(${pathRed}) center center scroll`
    }, [])

    return (
        <React.Fragment>
            <Helmet>
                <title>ورود | ‌کوییزلند</title>
                {/* <meta name="description" content="تماس با پشتیبانی کوییزلند" />
                <meta name="keywords" content="پشتیبانی کوییزلند" /> */}
            </Helmet>

            <div className='w-screen h-screen'>
                <div className="mx-auto mt-[50%] md:mt-[10%] w-11/12 md:w-5/12 text-center top-[10%]">
                    <h1 className="text-[3rem] mb-5 text-center text-[#ac272e] ">
                        به کوییزلند خوش آمدید
                    </h1>

                    <div className='grid md:grid-cols-2'>
                        <div className='flex flex-col my-auto'>
                            <LoginForm />
                            <button className='mt-5 text-gray-500'><a href='/'>برگشت به صفحه اصلی</a></button>
                        </div>
                        
                        <div className='m-auto'>
                            <img className='w-8/12 absolute center z-[-1] opacity-50 md:opacity-100 top-0 md:relative md:w-[14rem]' src="/static/img/Q.webp" alt="" />
                        </div>
                    </div>


                </div>
            </div>


        </React.Fragment>
    );
}

export default Login;