import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import { getTheme } from '../components/base';

const NotFound_404 = () => {
    const [theme, setTheme] = useState('dark')

    useEffect(() => {
        const theme = getTheme()
        setTheme(theme)
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
    }, [])

    return (
        <React.Fragment>

            <Helmet>
                <title>صفحه مورد نظر پیدا نشد | کوییزلند</title>
                <meta name="description" content='صفحه مورد نظر پیدا نشد' />
                <meta name="keywords" content="کوییزلند" />
                <meta name="robots" content="noindex"></meta>
            </Helmet>

            <div className="pageNotFound text-[16rem] h-[13rem] md:h-[34rem] md:absolute md:left-1/2 md:top-1/2 items-center flex md:text-[50rem]">404</div>

            <div class="basicPage wrapper-sm relative" style={{ background: (theme == 'light' ? '#f0f0f0' : '#0000008c'), backdropFilter: 'blur(15px)', boxShadow: 'none', zIndex: '1' }}>
                <h1> 🤔 اوپس! صفحه مورد نظر پیدا نشد </h1>
                <div class="mt-5">
                    <h2>
                        نیست یا در حال حاضر غیر فعال شده
                    </h2>
                </div>
                <div className='mt-10'>
                    <div className='px-4 py-2 border-2 border-red-900 rounded-xl'>
                        <h2>
                            <Link to='/contents?s=trend'>
                                مشاهده بهترین کوییز های این ماه
                            </Link>
                        </h2>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}

export default NotFound_404;