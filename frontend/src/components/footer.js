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
        <div className='w-screen py-12 pr-10 mt-10 footer rtl'>
            
            <div className='grid justify-center grid-cols-2 md:flex md:space-x-20 md:space-x-reverse'>

                <div className='mb-7'>
                    <dl className='space-y-2'>
                        <dt className='mb-3'>کوییز و تست ها</dt>
                        <a className='block' href="/contents?s=newest"><dd>جدیدترین</dd></a>
                        <a className='block' href="/contents?s=trend"><dd>محبوب ترین</dd></a>
                        <a className='block' href="/contents?s=views"><dd>پربازدیدترین</dd></a>
                    </dl>
                </div>

                <div className='mb-7'>
                    <dl className='space-y-2'>
                        <dt className='mb-3'>کتگوری ها</dt>
                        <Link className='block' to="/contents/movie-&-Series"><dd>فیلم و سریال</dd></Link>
                        <Link className='block' to="/contents/celebrity"><dd>سلبریتی</dd></Link>
                        <Link className='block' to="/contents/psychology"><dd>روانشناسی</dd></Link>
                    </dl>
                </div>

                <div className='mb-7'>
                    <dl className='space-y-2'>
                        <dt className='mb-3'>دسترسی سریع</dt>
                        <Link className='block' to='/'><dd>صفحه اصلی</dd></Link>
                        {/* <Link className='block' to='/blog'><dd>وبلاگ</dd></Link> */}
                        {/* <Link className='block' to='/guide'><dd>راهنما</dd></Link> */}
                        <a className='block' href="mailto:support@quizzland.net"><dd>تماس با ما</dd></a>
                        {/* <Link className='block' to='/advertiseContact'><dd>تبلیغات</dd></Link> */}
                        <Link className='block' to='/privacy-policy'><dd>حریم خصوصی</dd></Link>
                        {/* <Link className='block' to='/supportUs'><dd>حمایت</dd></Link> */}
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

            <div className="flex items-center justify-center mt-10 opacity-50">
                <p className='text-sm'>
                    {copyRightDate()} © تمام حقوق به کوییزلند تعلق دارد
                </p>
            </div>

        </div>
    );
}
 
export default Footer;