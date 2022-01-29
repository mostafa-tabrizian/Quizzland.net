import React, { useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'

import BackBtn from '../components/backBtn'
import Layout from '../components/layout'

const pathRed = '../images/bubbles.png'

const PageNotFound_404 = () => {

    useEffect(() => {
        if (document.querySelector('html')) {
            document.querySelector('html').style=`background: #0a0d13 url(${pathRed}) center center scroll !important`
        }
    }, [])
    
    return (
        <>
            <Layout>
                <Head>
                    <title>صفحه مورد نظر پیدا نشد | کوییزلند</title>
                    <meta name="description" content="صفحه مورد نظر پیدا نشد" />
                    <meta name="keywords" content="کوییزلند" />
                    <meta name="robots" content="noindex"></meta>
                </Head>
        
                <div className="basicPage wrapper-sm center relative" style={{background: '#0000008c', backdropFilter: 'blur(15px)', boxShadow: 'none', zIndex: '1'}}>
                    <h1> 🤔 صفحه ی مورد نظر پیدا نشد </h1>
                    <div className="space-sm">
                        <p>💖 اگه فکر میکنی اشتباهی پیش اومدی ممنون میشیم برامون به<Link href="mailto:support@quizzland.net?subject=  در سایت کوییزلند به یه مشکلی برخوردم به کد ۴۰۴"><a> این ایمیل</a></Link> پیام بدی</p>
                        <Link href="mailto:support@quizzland.net?subject=  در سایت کوییزلند به یه مشکلی برخوردم به کد ۴۰۴"><a target="_blank" rel="noreferrer">support@quizzland.net</a></Link>
                    </div>
                </div>

                <span className="pageNotFound">404</span>
        
                <BackBtn />
            </Layout>
        </>
    );
}
 
export default PageNotFound_404;