import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import { log } from '../../components/base'
import LoginForm from "../../components/auth/_form"

const pathRed = '/static/img/bubbles.webp'

const Login = () => {
    useEffect(() => {
        document.querySelector('header')?.remove()
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
    }, [])

    return (
        <React.Fragment>
            <Helmet>
                <title>ورود | ‌کوییزلند</title>
            </Helmet>

            <div className='w-screen h-screen'>
                <div className="mx-auto mt-[50%] md:mt-[10%] w-11/12 md:w-[40rem] text-center top-[10%]">
                    <h1 className="text-[3rem] mb-5 text-center text-[#ac272e] ">
                        به کوییزلند خوش آمدید
                    </h1>

                    <div className='flex'>
                        <div className='flex flex-col my-auto'>
                            <LoginForm />
                            <button className='mt-5 text-gray-500 text-right'><a href='/'>بازگشت به صفحه اصلی</a></button>
                        </div>
                        
                        <div className='mr-auto'>
                            <img className='w-8/12 absolute center z-[-1] opacity-50 md:opacity-100 top-0 md:relative md:w-[14rem]' src="/static/img/Q.webp" alt="" />
                        </div>
                    </div>


                </div>
            </div>


        </React.Fragment>
    );
}

export default Login;