import React, { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import BackBtn from '../components/backBtn'
import Layout from '../components/layout'

const pathRed = '../images/bubbles.png'

const Contact = () => {

    useEffect(() => {
        document.querySelector('html').style=`background: #0a0d13 url(${pathRed}) center center scroll !important`
    }, [])

    return (
        <>
            <Layout>
                <Head>
                    <title>تماس با ما | کوییزلند</title>
                    <meta name="description" content="تماس با پشتیبانی کوییزلند" />
                    <meta name="keywords" content="پشتیبانی کوییزلند" />
                </Head>

                <div className="basicPage center wrapper-sm">
                    <h3>برای تماس با ما میتونید از روش های زیر استفاده کنید </h3>
                    <div>
                        <ul className="contact__socialMedia flex flex-jc-c flex-ai-c">
                            {/* <li className="hoverAnimation"><a href="#">انستگرام</a></li> */}
                            {/* <li className="hoverAnimation"><a href="#">تلگرام</a></li> */}
                            <li className="hoverAnimation">
                                <Link href="mailto:support@quizzland.net"><a>ایمیل</a></Link>
                            </li>
                        </ul>
                        <Link href="mailto:support@quizzland.net"><a>support@quizzland.net</a></Link>
                    </div>
                    <p>
                        میتونی تمام نظرات و پیشنهادات خودت رو برامون بفرستی <br/> اینطوری کمکمون میکنی و باعث میشی سریعتر پیشرفت کنیم .💖
                    </p>
                </div>

                <BackBtn />
            </Layout>

        </>
    );
}
 
export default Contact;