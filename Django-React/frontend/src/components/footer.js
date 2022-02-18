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
        <div className='footer w-full py-12'>
            
            <div className='footer__container justify-center md:flex grid grid-cols-2 mr-10'>

                <div>
                    <h3>دسترسی سریع</h3>
                    <ul>
                        <li><Link to='/'><a>صفحه اصلی</a></Link></li>
                        {/* <li><Link to='/blog'><a>وبلاگ</a></Link></li> */}
                        <li><Link to='/guide'><a>راهنما</a></Link></li>
                        <li><Link to='/contact'><a>تماس با ما</a></Link></li>
                        <li><Link to='/advertising'><a>تبلیغات</a></Link></li>
                        <li><Link to='/privacy-policy'><a>حریم خصوصی</a></Link></li>
                        <li><Link to='/supportUs'><a>حمایت</a></Link></li>
                    </ul>
                </div>

                <div>
                    <h3>تست ها</h3>
                    <ul>
                        <li><Link to="/sort?st=newest_test"><a> جدیدترین ها </a></Link></li>
                        <li><Link to="/sort?st=monthly_test"><a> بهترین های ماه </a></Link></li>
                        <li><Link to="/sort?st=bestest_test"><a> بهترین ها </a></Link></li>
                    </ul>
                </div>

                <div>
                    <h3>کتگوری ها</h3>
                    <ul>
                        <li><Link to="/category/movieSeries"><a>فیلم و سریال</a></Link></li>
                        <li><Link to="/category/celebrity"><a>سلبریتی</a></Link></li>
                        <li><Link to="/category/psychology"><a>روانشناسی</a></Link></li>
                    </ul>
                </div>

                <div>
                    <h3>کوییز ها</h3>
                    <ul>
                        <li><Link to="/sort?st=newest"><a> جدیدترین ها </a></Link></li>
                        <li><Link to="/sort?st=monthly"><a> بهترین های ماه </a></Link></li>
                        <li><Link to="/sort?st=bestest"><a> بهترین ها </a></Link></li>
                    </ul>
                </div>

                {/* <div>
                    <h3>با ما همراه باشید</h3>
                    <ul className='flex flex-ai-c justify-center'>
                        <li><a to='#'>
                            <img src={instagramIcon} alt='quizzlnad instagram' />
                        </a></li>
                    </ul>
                </div> */}

            </div>

            <div className="flex justify-center flex-ai-c opacity-50">
                <p className='text-sm'>
                    {copyRightDate()} © تمام حقوق به کوییزلند تعلق دارد
                </p>
            </div>

        </div>
    );
}
 
export default Footer;