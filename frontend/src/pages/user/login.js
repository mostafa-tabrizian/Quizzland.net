import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { log } from '../../components/base'
import LoginForm from "../../components/user/loginForm";

const pathRed = '/static/img/bubbles.webp'

const Login = () => {
    useEffect(() => {
        log('hi')
        document.querySelector('body').style = `background: #060101 url(${pathRed}) center center scroll`
    }, [])

    return (
        <React.Fragment>
            <Helmet>
                <title>ورود | ‌کوییزلند</title>
                {/* <meta name="description" content="تماس با پشتیبانی کوییزلند" />
                <meta name="keywords" content="پشتیبانی کوییزلند" /> */}
            </Helmet>

            <div className='w-screen h-screen'>
                <div className="absolute m-auto text-center center top-[15%]">
                    <h1 className="text-[3rem] mb-5 text-center text-[#ac272e] ">
                        به کوییزلند خوش آمدید
                    </h1>

                    <div className='grid md:grid-cols-2'>
                        <div className='border rounded-lg mt-3 order-1 md:order-[0] bg-[#060101] shadow-[inset_0_0_15px_#ac272e] border-[#ac272e] px-3 py-1'>
                            <LoginForm />
                        </div>
                        
                        <div className='m-auto'>
                            <img className='w-[5rem] md:w-[14rem]' src="/static/img/Q.webp" alt="" />
                        </div>
                    </div>

                </div>
            </div>


        </React.Fragment>
    );
}

export default Login;