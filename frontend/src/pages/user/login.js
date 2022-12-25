import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { log } from '../../components/base'
import LoginForm from "../../components/auth/_form"

const Login = () => {
    useEffect(() => {
        document.querySelector('header')?.remove()
        document.querySelector('.footer')?.remove()
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
        document.querySelector('#land').style = `overflow: hidden`
    }, [])

    return (
        <React.Fragment>
            <Helmet>
                <title>ورود | ‌کوییزلند</title>
            </Helmet>

            <div className='w-screen h-screen'>
                <div className="mx-auto mt-[100%] md:mt-[10%] w-11/12 md:w-[40rem] text-center top-[10%]">
                    <h1 className="text-[2rem] md:text-[3rem] mb-10 text-center textShadow text-[#ac272e] ">
                        به کوییزلند خوش آمدید
                    </h1>

                    <div className='mt-5'>
                        <div className='flex flex-col my-auto'>
                            <LoginForm />
                            <button className='mt-10 text-center text-sm text-gray-500'><a href='/'>بازگشت به صفحه اصلی</a></button>
                        </div>
                        
                        <div className='md:mr-auto'>
                            <img className='w-8/12 absolute center z-[-1] opacity-50 top-[15%] md:w-[25%]' src="/static/img/Q.webp" alt="" />
                        </div>
                    </div>


                </div>
            </div>


        </React.Fragment>
    );
}

export default Login;