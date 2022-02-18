import { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'

import { log } from './base'
import Search from '../components/search'

const Header = (props) => {
    const [categoryNavigationOpen, setCategoryNavigationOpen] = useState(false)
    const [quizNavigationOpen, setQuizNavigationOpen] = useState(false)
    const [pointyNavigationOpen, setPointyNavigationOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    const openCloseMenu = () => {
        setMenuOpen(menuOpen ? false : true)
    }

    const openCloseCategoryNavigation = () => {
        setCategoryNavigationOpen(categoryNavigationOpen ? false : true)
        setQuizNavigationOpen(false)
        setPointyNavigationOpen(false)
    }

    const openCloseQuizNavigation = () => {
        setQuizNavigationOpen(quizNavigationOpen ? false : true)
        setCategoryNavigationOpen(false)
        setPointyNavigationOpen(false)
    }

    const openClosePointyNavigation = () => {
        setPointyNavigationOpen(pointyNavigationOpen ? false : true)
        setCategoryNavigationOpen(false)
        setQuizNavigationOpen(false)
    }

    return (
        <>


            <header className={`header text-xl p-4 relative`}>

                {/* <Head>
                    <script type="text/javascript">
                        {`
                            var head = document.getElementsByTagName("head")[0];
                            var script = document.createElement("script");
                            script.type = "text/javascript";
                            script.async=1;
                            script.src = "https://s1.mediaad.org/serve/Quizzland.net/loader.js" ;
                            head.appendChild(script); 
                        `}
                    </script>

                    <script type="text/javascript">
                        {`
                            (function(){
                            var now = new Date();
                            var head = document.getElementsByTagName('head')[0];
                            var script = document.createElement('script');
                            script.async = true;
                            var script_address = 'https://cdn.yektanet.com/js/Quizlqnd.com/native-Quizlqnd.com-18610.js';
                            script.src = script_address + '?v=' + now.getFullYear().toString() + '0' + now.getMonth() + '0' + now.getDate() + '0' + now.getHours();
                            head.appendChild(script);
                            })();
                        `}
                    </script>
                </Head> */}


                <nav className="flex flex-ai-c flex-jc-sb">
                    <div>
                        <Link href="/">
                            <a className='flex header__logo flex-jc-sb flex-ai-c md:hidden'>
                                <Image
                                    src='/images/Q-small.png'
                                    alt='کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشناسی'
                                    width={24}
                                    height={35}
                                />
                                <span>uizzland</span>
                            </a>
                        </Link>
                    </div>

                    <div className={`md:space-x-5 py-5 mr-6 z-10 relative ${props.colorOfHeader} hidden md:flex flex-ai-c`}>
                        <div className="hoverAnimation md:space-x-7">
                            {/* <button className="header__btn">
                                <Link href="/blog"><a> وبلاگ </a></Link>
                            </button> */}
                            <button className="header__btn" onClick={openClosePointyNavigation}>تست ها</button>
                            <button className="header__btn" onClick={openCloseQuizNavigation}>کویز ها</button>
                            <button className='header__btn' onClick={openCloseCategoryNavigation}>کتگوری ها</button>
                        </div>

                        <Link href="/">
                            <a className="flex header__logo flex-jc-sb flex-ai-c">
                                <Image
                                    src='/images/Q-small.png'
                                    alt='کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشناسی'
                                    width={24}
                                    height={35}
                                />
                                <span>uizzland</span>
                            </a>
                        </Link>


                    </div>

                    <Search />

                    <ul className={`right-[11rem] ${props.colorOfHeader} subHeader top-20 backdrop-blur-lg bg-[#96484852] rounded-2xl px-5 py-7 z-10 line absolute text-right ${categoryNavigationOpen ? 'opacity-100' : 'opacity-0 pointerOff'}`}>
                        <li><Link href="/category/movie-series"><a>🎬 فیلم و سریال</a></Link></li>
                        <li><Link href="/category/celebrity"><a>✨ سلبریتی</a></Link></li>
                        <li><Link href="/category/psychology"><a>🧠 روانشناسی</a></Link></li>
                    </ul>

                    <ul className={`right-[16.5rem] ${props.colorOfHeader} subHeader top-20 backdrop-blur-lg bg-[#96484852] rounded-2xl px-5 py-7 z-10 line absolute text-right ${quizNavigationOpen ? 'opacity-100' : 'opacity-0 pointerOff'}`}>
                        <li><Link href="/sort?st=newest"><a> ⏳ جدیدترین ها </a></Link></li>
                        <li><Link href="/sort?st=monthlyBestest"><a> 👑 بهترین های ماه </a></Link></li>
                        <li><Link href="/sort?st=bestest"><a> 👑 بهترین ها </a></Link></li>
                    </ul>

                    <ul className={`right-[21rem] ${props.colorOfHeader} subHeader top-20 backdrop-blur-lg bg-[#96484852] rounded-2xl px-5 py-7 z-10 line absolute text-right ${pointyNavigationOpen ? 'opacity-100' : 'opacity-0 pointerOff'}`}>
                        <li><Link href="/sort?st=newest_test"><a> ⏳ جدیدترین ها </a></Link></li>
                        <li><Link href="/sort?st=monthlyBestest_test"><a> 👑 بهترین های ماه </a></Link></li>
                        <li><Link href="/sort?st=bestest_test"><a> 👑 بهترین ها </a></Link></li>
                    </ul>

                    {/* Menu */}
                    <button type="button" onClick={openCloseMenu} className={`header__menu__openBtn header__btn absolute ${props.colorOfHeader} md:hidden`} aria-label="Menu Button">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <line x1="3" y1="12" x2="21" y2="12" />  <line x1="3" y1="6" x2="21" y2="6" />  <line x1="3" y1="18" x2="21" y2="18" /></svg>
                    </button>

                    <div className={`header__menu fixed text-right z-10 h-[25rem] w-[100%]
                                    bg-[rgba(148, 148, 148, 0.3)] top-0 right-0
                                    rounded-b-[40px] md:hidden ${menuOpen ? '' : 'slideMenu-hide'}
                                    pr-8 pt-5 absolute top-0 right-0`}>
                        <button onClick={openCloseMenu} className="header__menu__closeBtn" aria-label="Close Menu Button">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>

                        <div className='mt-5'>
                            <h4 className='text-xl'>کتگوری ها</h4>
                            <ul className='flex space-x-6 space-x-reverse'>
                                <li className='text-lg'><Link href="/category/movie-series"><a >فیلم و سریال 🎬</a></Link></li>
                                <li className='text-lg'><Link href="/category/celebrity"><a>سلبریتی ✨</a></Link></li>
                                <li className='text-lg'><Link href="/category/psychology"><a>روانشناسی 🧠</a></Link></li>
                            </ul>
                        </div>
                        <div className='mt-5'>
                            <h4 className='text-xl'>کویز ها</h4>
                            <ul className='flex space-x-6 space-x-reverse'>
                                <li className='text-lg' onClick={openCloseMenu}><Link href="/sort?st=newest"><a> جدیدترین ها </a></Link></li>
                                <li className='text-lg' onClick={openCloseMenu}><Link href="/sort?st=monthlyBestest"><a> بهترین های ماه </a></Link></li>
                                <li className='text-lg' onClick={openCloseMenu}><Link href="/sort?st=bestest"><a> بهترین ها </a></Link></li>
                            </ul>
                        </div>
                        <div className='mt-5'>
                            <h4 className='text-xl'>تست ها</h4>
                            <ul className='flex space-x-6 space-x-reverse'>
                                <li className='text-lg' onClick={openCloseMenu}><Link href="/sort?st=newest_test"><a> جدیدترین ها </a></Link></li>
                                <li className='text-lg' onClick={openCloseMenu}><Link href="/sort?st=monthlyBestest_test"><a> بهترین های ماه </a></Link></li>
                                <li className='text-lg' onClick={openCloseMenu}><Link href="/sort?st=bestest_test"><a> بهترین ها </a></Link></li>
                            </ul>
                        </div>
                        <div className='mt-5'>
                            <ul className='flex space-x-6 space-x-reverse'>
                                <li className='text-lg' onClick={openCloseMenu}><Link href="/blog"><a> وبلاگ </a></Link></li>
                                <li className='text-lg' onClick={openCloseMenu}><Link href="/guide"><a> راهنما </a></Link></li>
                                <li className='text-lg' onClick={openCloseMenu}><Link href="/contact"><a> تماس با ما </a></Link></li>
                            </ul>
                        </div>
                    </div>

                </nav>

                {/* <LoadingScreen /> */}

            </header>
        </>
    );
}

export default Header;