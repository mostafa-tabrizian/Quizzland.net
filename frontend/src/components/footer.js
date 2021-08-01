import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'

import { log } from './base'

const instagramIcon = '/static/img/instagram-icon.svg'

const Footer = () => {
    return (
        <div className='footer'>
            
            <div className='footer__container flex-jc-c'>

                <div>
                    <h3>کوئیز ها</h3>
                    <ul>
                        <li><Link to="/sort?q=newest">جدیدترین ها</Link></li>
                        <li><Link to="/sort?q=bestest">بهترین ها</Link></li>
                        <li><Link to="/sort?q=monthlyBestest">بهترین های ماه</Link></li>
                        <li><HashLink to="/#sort">مرتب شده</HashLink></li>
                    </ul>
                </div>

                <div>
                    <h3>کتگوری ها</h3>
                    <ul>
                        <li><Link to="/category/movieSeries">فیلم و سریال</Link></li>
                        <li><Link to="/category/celebrity">سلبریتی</Link></li>
                    </ul>
                </div>

                <div>
                    <h3>دسترسی سریع</h3>
                    <ul>
                        <li><Link to='/guide'>راهنما</Link></li>
                        <li><Link to='/contact'>تماس با ما</Link></li>
                        <li><Link to="/ads">تبلیغات</Link></li>
                        <li><Link to="/privacy-policy">حریم خصوصی</Link></li>
                        <li><Link to="/support">حمایت</Link></li>
                    </ul>
                </div>

                <div>
                    <h3>با ما همراه باشید</h3>
                    <ul className='flex flex-ai-c flex-jc-c'>
                        <li><a href='#'>
                            <img src={instagramIcon} alt='quizzlnad instagram' />
                        </a></li>
                    </ul>
                </div>

            </div>

            <div className="footer__copyRight flex flex-jc-c flex-ai-c">
                <p>
                    1400-2021 © تمام حقوق به کوئیزلند تعلق دارد
                </p>
            </div>

        </div>
    );
}
 
export default Footer;