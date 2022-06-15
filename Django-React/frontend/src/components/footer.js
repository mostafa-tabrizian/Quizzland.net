import { Link } from 'react-router-dom'

import { log } from './base'

const copyRightDate = () => {
    const date = new Date();
    const westYear = date.getFullYear()
    const eastYear = date.toLocaleDateString('fa-IR').slice(0, 4)
    return `${westYear}-${eastYear}`
}

const Footer = () => {
    return (
        <div className='footer w-full py-12 mt-10'>
            
            <div className='footer__container justify-center grid grid-cols-2 md:flex md:space-x-20 md:space-x-reverse mr-10'>

                <div>
                    <h3>کوییز و تست ها</h3>
                    <ul>
                        <li><a href="/sort?s=newest"> جدیدترین </a></li>
                        <li><a href="/sort?s=trend"> محبوب ترین </a></li>
                        <li><a href="/sort?s=views"> پربازدیدترین </a></li>
                    </ul>
                </div>

                <div>
                    <h3>کتگوری ها</h3>
                    <ul>
                        <li><Link to="/category/movie-&-Series">فیلم و سریال</Link></li>
                        <li><Link to="/category/celebrity">سلبریتی</Link></li>
                        <li><Link to="/category/psychology">روانشناسی</Link></li>
                    </ul>
                </div>

                <div>
                    <h3>دسترسی سریع</h3>
                    <ul>
                        <li><Link to='/'>صفحه اصلی</Link></li>
                        {/* <li><Link to='/blog'>وبلاگ</Link></li> */}
                        {/* <li><Link to='/guide'>راهنما</Link></li> */}
                        <li><Link to='/contact'>تماس با ما</Link></li>
                        {/* <li><Link to='/advertiseContact'>تبلیغات</Link></li> */}
                        {/* <li><Link to='/privacy-policy'>حریم خصوصی</Link></li> */}
                        {/* <li><Link to='/supportUs'>حمایت</Link></li> */}
                    </ul>
                </div>


                {/* <div>
                    <h3>با ما همراه باشید</h3>
                    <ul className='flex items-center justify-center'>
                        <li><a to='#'>
                            <img src={instagramIcon} alt='quizzlnad instagram' />
                        </li>
                    </ul>
                </div> */}

            </div>

            <div className="flex justify-center mt-10 items-center opacity-50">
                <p className='text-sm'>
                    {copyRightDate()} © تمام حقوق به کوییزلند تعلق دارد
                </p>
            </div>

        </div>
    );
}
 
export default Footer;