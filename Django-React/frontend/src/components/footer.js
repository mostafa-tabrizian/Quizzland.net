import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'

import { log } from './base'

const instagramIcon = '/static/img/instagram-icon.svg'

const copyRightDate = () => {
    const date = new Date();
    const westYear = date.getFullYear()
    const eastYear = date.toLocaleDateString('fa-IR').slice(0, 4)
    return `${westYear}-${eastYear}`
}

const Footer = (props) => {
    return (
        <div className='footer'>
            
            <div className='footer__container flex-jc-c'>

                <div>
                    <h3>کوییز ها</h3>
                    {
                        props.linkType == 'Link' &&
                        <ul>
                            <li><Link to="/sort?q=newest">جدیدترین ها</Link></li>
                            <li><Link to="/sort?q=monthlyBestest">بهترین های ماه</Link></li>
                            <li><Link to="/sort?q=bestest">بهترین ها</Link></li>
                        </ul>
                    }
                    {
                        props.linkType == 'Hot' &&
                        <ul>
                            <li><a href="/sort?q=newest">جدیدترین ها</a></li>
                            <li><a href="/sort?q=monthlyBestest">بهترین های ماه</a></li>
                            <li><a href="/sort?q=bestest">بهترین ها</a></li>
                        </ul>
                    }
                </div>

                <div>
                    <h3>تست ها</h3>
                    {
                        props.linkType == 'Link' &&
                        <ul>
                            <li><Link to="/sort?q=newest_test">جدیدترین ها</Link></li>
                            <li><Link to="/sort?q=monthlyBestest_test">بهترین های ماه</Link></li>
                            <li><Link to="/sort?q=bestest_test">بهترین ها</Link></li>
                        </ul>
                    }
                    {
                        props.linkType == 'Hot' &&
                        <ul>
                            <li><a href="/sort?q=newest_test">جدیدترین ها</a></li>
                            <li><a href="/sort?q=monthlyBestest_test">بهترین های ماه</a></li>
                            <li><a href="/sort?q=bestest_test">بهترین ها</a></li>
                        </ul>
                    }
                </div>

                <div>
                    <h3>کتگوری ها</h3>
                    <ul>
                        <li><a href="/category/movieSeries">فیلم و سریال</a></li>
                        <li><a href="/category/celebrity">سلبریتی</a></li>
                        <li><a href="/category/psychology">روانشناسی</a></li>
                    </ul>
                </div>

                <div>
                    <h3>دسترسی سریع</h3>
                    {
                        props.linkType == 'Link' &&
                        <ul>
                            <li><Link to='/'>صفحه اصلی</Link></li>
                            <li><Link to='/blog'>وبلاگ</Link></li>
                            <li><Link to='/guide'>راهنما</Link></li>
                            <li><Link to='/contact'>تماس با ما</Link></li>
                            <li><Link to="/ads">تبلیغات</Link></li>
                            <li><Link to="/privacy-policy">حریم خصوصی</Link></li>
                            <li><Link to="/support">حمایت</Link></li>
                        </ul>
                    }
                    {
                        props.linkType == 'Hot' &&
                        <ul>
                            <li><a href='/'>صفحه اصلی</a></li>
                            <li><a href='/blog'>وبلاگ</a></li>
                            <li><a href='/guide'>راهنما</a></li>
                            <li><a href='/contact'>تماس با ما</a></li>
                            <li><a href="/ads">تبلیغات</a></li>
                            <li><a href="/privacy-policy">حریم خصوصی</a></li>
                            <li><a href="/support">حمایت</a></li>
                        </ul>
                    }
                </div>

                {/* <div>
                    <h3>با ما همراه باشید</h3>
                    <ul className='flex flex-ai-c flex-jc-c'>
                        <li><a href='#'>
                            <img src={instagramIcon} alt='quizzlnad instagram' />
                        </a></li>
                    </ul>
                </div> */}

            </div>

            <div className="footer__copyRight flex flex-jc-c flex-ai-c">
                <p>
                    {copyRightDate()} © تمام حقوق به کوییزلند تعلق دارد
                </p>
            </div>

        </div>
    );
}
 
export default Footer;