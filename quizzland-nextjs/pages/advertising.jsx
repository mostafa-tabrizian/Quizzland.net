import React, { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import BackBtn from '../components/backBtn'
import Layout from '../components/layout'

const pathRed = '../images/bubbles.png'

const Ads = () => {

    useEffect(() => {
        document.querySelector('html').style = `background: #0a0d13 url(${pathRed}) center center scroll !important`
    }, [])

    return (
        <>
            <Layout>
                <Head>
                    <title>تبلیغات | کوییزلند</title>
                    <meta name="description" content="تبلیغات در سایت کوییزلند" />
                    <meta name="keywords" content="تبلیغات, کوییزلند" />
                </Head>

                <div className="basicPage center wrapper-sm">
                    <h3>برای تبلیغ در بنر های کوییزلند میتونید با پشتیبانی بابت هماهنگی در تماس باشید</h3>
                    <Link href="mailto:support@quizzland.net"><a>support@quizzland.net</a></Link>
                    <div>
                        <ul className="text-red-600 font-bold flex justify-center flex-ai-c">
                            {/* <li><Link href="#"><a>انستگرام</a></Link></li> */}
                            {/* <li><Link href="#"><a>تلگرام</a></Link></li> */}
                            <li><Link href="mailto:support@quizzland.net"><a>ایمیل</a></Link></li>
                        </ul>
                    </div>
                    <h5>💗کوییزلند</h5>
                </div>

                <BackBtn />
            </Layout>

        </>
    );
}

export default Ads;