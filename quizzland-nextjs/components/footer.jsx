import { useState, useEffect } from 'react';
import Link from 'next/link'

import { log } from './base'

const instagramIcon = '../images/instagram-icon.svg'

const copyRightDate = () => {
    const date = new Date();
    const westYear = date.getFullYear()
    const eastYear = date.toLocaleDateString('fa-IR').slice(0, 4)
    return `${westYear}-${eastYear}`
}

const Footer = (props) => {
    return (
        <div className='footer'>
            
            <div className='footer__container justify-center'>

                <div>
                    <h3>کوییز ها</h3>
                    <ul>
                        <li><Link href="/sort?st=newest"><a> جدیدترین ها </a></Link></li>
                        <li><Link href="/sort?st=monthlyBestest"><a> بهترین های ماه </a></Link></li>
                        <li><Link href="/sort?st=bestest"><a> بهترین ها </a></Link></li>
                    </ul>
                </div>

                <div>
                    <h3>تست ها</h3>
                    <ul>
                        <li><Link href="/sort?st=newest_test"><a> جدیدترین ها </a></Link></li>
                        <li><Link href="/sort?st=monthlyBestest_test"><a> بهترین های ماه </a></Link></li>
                        <li><Link href="/sort?st=bestest_test"><a> بهترین ها </a></Link></li>
                    </ul>
                </div>

                <div>
                    <h3>کتگوری ها</h3>
                    <ul>
                        <li><Link href="/category/movieSeries"><a>فیلم و سریال</a></Link></li>
                        <li><Link href="/category/celebrity"><a>سلبریتی</a></Link></li>
                        <li><Link href="/category/psychology"><a>روانشناسی</a></Link></li>
                    </ul>
                </div>

                <div>
                    <h3>دسترسی سریع</h3>
                    <ul>
                        <li><Link href='/'><a>صفحه اصلی</a></Link></li>
                        <li><Link href='/blog'><a>وبلاگ</a></Link></li>
                        <li><Link href='/guide'><a>راهنما</a></Link></li>
                        <li><Link href='/contact'><a>تماس با ما</a></Link></li>
                        <li><Link href='/advertising'><a>تبلیغات</a></Link></li>
                        <li><Link href='/privacy-policy'><a>حریم خصوصی</a></Link></li>
                        <li><Link href='/supportUs'><a>حمایت</a></Link></li>
                    </ul>
                </div>

                {/* <div>
                    <h3>با ما همراه باشید</h3>
                    <ul className='flex flex-ai-c justify-center'>
                        <li><a href='#'>
                            <img src={instagramIcon} alt='quizzlnad instagram' />
                        </a></li>
                    </ul>
                </div> */}

            </div>

            <div className="footer__copyRight flex justify-center flex-ai-c">
                <p>
                    {copyRightDate()} © تمام حقوق به کوییزلند تعلق دارد
                </p>
            </div>

        </div>
    );
}
 
export default Footer;