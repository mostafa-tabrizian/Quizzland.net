import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import Header from '../components/header'

const pathRed = '/static/img/bubbles.png'

const NotFound_404 = () => {

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: #0a0d13 url('${pathRed}') center center scroll !important`
        }
    }, [])
    
    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <title>کوییز مورد نظر پیدا نشد |‌ کوییزلند</title>
                <meta name="description" content="کوییز مورد نظر پیدا نشد" />
                <meta name="keywords" content="کوییزلند" />
                <meta name="robots" content="noindex"></meta>
            </Helmet>

            <div className="pageNotFound text-[18rem] h-[13rem] md:h-[34rem] md:absolute md:left-1/2 md:top-1/2 items-center flex md:text-[50rem]">404</div>

            <div class="basicPage wrapper-sm relative" style={{background: '#0000008c', backdropFilter: 'blur(15px)', boxShadow: 'none', zIndex: '1' }}>
                <h1> 🤔 کوییز/تست مورد نظر پیدا نشد </h1>
                <div class="mt-5">
                    این کوییز/تست موجود نمی‌باشد یا در حال حاضر غیر فعال شده است
                </div>
                <div className='mt-10 space-y-3'>
                    <div>
                        اینجا رو کلیک کنید و بهترین کوییز/تست های این ماه رو ببینید
                    </div>
                    <div className='border-2 border-red-900 rounded-xl px-4 py-2'>
                        <Link to='/sort?s=trend'>
                            مشاهده بهترین کوییز/تست های این ماه    
                        </Link>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}

export default NotFound_404;