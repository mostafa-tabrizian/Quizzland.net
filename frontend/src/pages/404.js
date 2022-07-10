import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import Header from '../components/header'
import Footer from '../components/footer'
import { takeParameterFromUrl, getTheme, log } from '../components/base';

const pathRed = '/static/img/bubbles.webp'

const NotFound_404 = () => {
    const [message, setMessage] = useState(null)
    const [theme, setTheme] = useState('dark')

    useEffect(() => {
        selectMessage()
        const theme = getTheme()
        setTheme(theme)
        document.querySelector('body').style = `background: ${theme == 'dark' ? '#060101' : 'white'} url(${pathRed}) center center scroll`
    }, [])

    const selectMessage = () => {
        const target =  takeParameterFromUrl('t')

        switch(target) {
            case 'q':
                setMessage('🤔 کوییز/تست مورد نظر پیدا نشد')
                break
            default:
                setMessage('🤔 صفحه مورد نظر پیدا نشد')
        }
    }

    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <title>{message} |‌ کوییزلند</title>
                <meta name="description" content={message} />
                <meta name="keywords" content="کوییزلند" />
                <meta name="robots" content="noindex"></meta>
            </Helmet>

            <div className="pageNotFound text-[18rem] h-[13rem] md:h-[34rem] md:absolute md:left-1/2 md:top-1/2 items-center flex md:text-[50rem]">404</div>

            <div class="basicPage wrapper-sm relative" style={{ background: (theme == 'dark' ? '#0000008c' : '#f0f0f0'), backdropFilter: 'blur(15px)', boxShadow: 'none', zIndex: '1' }}>
                <h1> {message} </h1>
                <div class="mt-5">
                    <h2>
                        وجود ندارد یا در حال حاضر غیر فعال شده است
                    </h2>
                </div>
                <div className='mt-10'>
                    <div className='px-4 py-2 border-2 border-red-900 rounded-xl'>
                        <h2>
                            <Link to='/sort?s=trend'>
                                مشاهده بهترین کوییز/تست های این ماه
                            </Link>
                        </h2>
                    </div>
                </div>
            </div>

            <Footer />
        </React.Fragment>
    );
}

export default NotFound_404;