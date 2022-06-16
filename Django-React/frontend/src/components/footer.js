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
        <div className='footer w-[110vw] mr-[-1rem] py-12 mt-10'>
            
            <div className='justify-center grid grid-cols-2 md:flex md:space-x-20 md:space-x-reverse mr-10'>

                <div>
                    <dl>
                        <dt>کوییز و تست ها</dt>
                        <a href="/sort?s=newest"><dd>جدیدترین</dd></a>
                        <a href="/sort?s=trend"><dd>محبوب ترین</dd></a>
                        <a href="/sort?s=views"><dd>پربازدیدترین</dd></a>
                    </dl>
                </div>

                <div>
                    <dl>
                        <dt>کتگوری ها</dt>
                        <Link to="/category/movie-&-Series"><dd>فیلم و سریال</dd></Link>
                        <Link to="/category/celebrity"><dd>سلبریتی</dd></Link>
                        <Link to="/category/psychology"><dd>روانشناسی</dd></Link>
                    </dl>
                </div>

                <div>
                    <dl>
                        <dt>دسترسی سریع</dt>
                        <Link to='/'><dd>صفحه اصلی</dd></Link>
                        {/* <Link to='/blog'><dd>وبلاگ</dd></Link> */}
                        {/* <Link to='/guide'><dd>راهنما</dd></Link> */}
                        <Link to='/contact'><dd>تماس با ما</dd></Link>
                        {/* <Link to='/advertiseContact'><dd>تبلیغات</dd></Link> */}
                        {/* <Link to='/privacy-policy'><dd>حریم خصوصی</dd></Link> */}
                        {/* <Link to='/supportUs'><dd>حمایت</dd></Link> */}
                    </dl>
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