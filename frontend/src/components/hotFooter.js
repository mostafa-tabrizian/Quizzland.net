import { log } from './base'

const instagramIcon = '/static/img/instagram-icon.svg'

const Footer = () => {
    return (
        <div className='footer'>
            
            <div className='footer__container flex-jc-c'>

                <div>
                    <h3>کوییز ها</h3>
                    <ul>
                        <li><a href="/sort?q=newest">جدیدترین ها</a></li>
                        <li><a href="/sort?q=bestest">بهترین ها</a></li>
                        <li><a href="/sort?q=monthlyBestest">بهترین های ماه</a></li>
                        <li><a href="/#sort">مرتب شده</a></li>
                    </ul>
                </div>

                <div>
                    <h3>کتگوری ها</h3>
                    <ul>
                        <li><a href="/category/movieSeries">فیلم و سریال</a></li>
                        <li><a href="/category/celebrity">سلبریتی</a></li>
                    </ul>
                </div>

                <div>
                    <h3>دسترسی سریع</h3>
                    <ul>
                        <li><a href='/guide'>راهنما</a></li>
                        <li><a href='/contact'>تماس با ما</a></li>
                        <li><a href="/ads">تبلیغات</a></li>
                        <li><a href="/privacy-policy">حریم خصوصی</a></li>
                        <li><a href="/support">حمایت</a></li>
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
                    1400-2021 © تمام حقوق به کوییزلند تعلق دارد
                </p>
            </div>

        </div>
    );
}
 
export default Footer;