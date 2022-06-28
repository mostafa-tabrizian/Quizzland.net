import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { log } from '../../components/base'
import LoginForm from "../../components/user/loginForm";

const pathRed = '/static/img/bubbles.webp'

const Login = () => {
    useEffect(() => {
        if (document.querySelector('body')) {
            document.querySelector('body').style = `background: #060101 url(${pathRed}) center center scroll !important`
        }
    }, [])

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

                    <LoginForm />

                </div>
            </div>

        </React.Fragment>
    );
}

export default Login;