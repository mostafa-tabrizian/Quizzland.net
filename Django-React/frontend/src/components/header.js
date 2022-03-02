import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from "react-helmet";

import { log } from './base'
import Search from './search'

const Header = (props) => {
    const [categoryNavigationOpen, setCategoryNavigationOpen] = useState(false)
    const [quizNavigationOpen, setQuizNavigationOpen] = useState(false)
    const [pointyNavigationOpen, setPointyNavigationOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        componentChangeDetector()
    })

    const componentChangeDetector = () => {
        (function (history) {

            let pushState = history.pushState;
            history.pushState = function () {
                pushState.apply(history, arguments);
            };

        })(window.history);
    }

    const openCloseMenu = () => {
        setMenuOpen(menuOpen ? false : true)
    }

    const openCloseCategoryNavigation = () => {
        setCategoryNavigationOpen(categoryNavigationOpen ? false : true)
        // close every other panel
        setQuizNavigationOpen(false)
        setPointyNavigationOpen(false)
    }

    const openCloseQuizNavigation = () => {
        setQuizNavigationOpen(quizNavigationOpen ? false : true)
        // close every other panel
        setCategoryNavigationOpen(false)
        setPointyNavigationOpen(false)
    }

    const openClosePointyNavigation = () => {
        setPointyNavigationOpen(pointyNavigationOpen ? false : true)
        // close every other panel
        setCategoryNavigationOpen(false)
        setQuizNavigationOpen(false)
    }

    return (
        <React.Fragment>


            <header className="header text-xl p-4 z-10 relative">

                <Helmet>
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
                </Helmet>


                <nav className="flex flex-ai-c flex-jc-sb">
                    <div>
                        <Link to="/" className='flex header__logo flex-jc-sb flex-ai-c md:hidden'>
                            <span>uizzland</span>
                            <img
                                src='/static/img/Q-small.png'
                                alt='کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشناسی'
                                width={24}
                                height={35}
                            />
                        </Link>
                    </div>

                    <div className={`md:space-x-5 py-5 mr-6 z-10 relative ${props.colorOfHeader} hidden md:flex flex-ai-c`}>
                        <div className="hoverAnimation md:space-x-7 mr-4">
                            {/* <button className="header__btn">
                                <Link to="/blog"> وبلاگ </Link>
                            </button> */}
                            <button className="header__btn" onClick={openClosePointyNavigation}>تست ها</button>
                            <button className="header__btn" onClick={openCloseQuizNavigation}>کویز ها</button>
                            <button className='header__btn' onClick={openCloseCategoryNavigation}>کتگوری ها</button>
                        </div>

                        <Link to="/" className="flex header__logo flex-jc-sb flex-ai-c">
                            <span>uizzland</span>
                            <img
                                src='/static/img/Q-small.png'
                                alt='کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشناسی'
                                width={24}
                                height={35}
                            />
                        </Link>


                    </div>

                    <Search />

                    <ul className={`right-[11rem] ${props.colorOfHeader} subHeader top-20 backdrop-blur-lg bg-[#96484852] rounded-2xl px-5 py-7 z-10 line absolute text-right ${categoryNavigationOpen ? 'opacity-100' : 'opacity-0 pointerOff'}`}>
                        <li><Link to="/category/movie-&-series">🎬 فیلم و سریال</Link></li>
                        <li><Link to="/category/celebrity">✨ سلبریتی</Link></li>
                        <li><Link to="/category/psychology">🧠 روانشناسی</Link></li>
                    </ul>

                    <ul className={`right-[16.5rem] ${props.colorOfHeader} subHeader top-20 backdrop-blur-lg bg-[#96484852] rounded-2xl px-5 py-7 z-10 line absolute text-right ${quizNavigationOpen ? 'opacity-100' : 'opacity-0 pointerOff'}`}>
                        <li><Link to="/sort?s=newest"> ⏳ جدیدترین ها </Link></li>
                        <li><Link to="/sort?s=monthly"> 👑 بهترین های ماه </Link></li>
                        <li><Link to="/sort?s=bestest"> 👑 بهترین ها </Link></li>
                    </ul>

                    <ul className={`right-[21rem] ${props.colorOfHeader} subHeader top-20 backdrop-blur-lg bg-[#96484852] rounded-2xl px-5 py-7 z-10 line absolute text-right ${pointyNavigationOpen ? 'opacity-100' : 'opacity-0 pointerOff'}`}>
                        <li><Link to="/sort?s=newest_test"> ⏳ جدیدترین ها </Link></li>
                        <li><Link to="/sort?s=monthly_test"> 👑 بهترین های ماه </Link></li>
                        <li><Link to="/sort?s=bestest_test"> 👑 بهترین ها </Link></li>
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
                                <li className='text-lg'><Link to="/category/movie-&-series">فیلم و سریال 🎬</Link></li>
                                <li className='text-lg'><Link to="/category/celebrity">سلبریتی ✨</Link></li>
                                <li className='text-lg'><Link to="/category/psychology">روانشناسی 🧠</Link></li>
                            </ul>
                        </div>
                        <div className='mt-5'>
                            <h4 className='text-xl'>کویز ها</h4>
                            <ul className='flex space-x-6 space-x-reverse'>
                                <li className='text-lg' onClick={openCloseMenu}><Link to="/sort?s=newest"> جدیدترین ها </Link></li>
                                <li className='text-lg' onClick={openCloseMenu}><Link to="/sort?s=monthly"> بهترین های ماه </Link></li>
                                <li className='text-lg' onClick={openCloseMenu}><Link to="/sort?s=bestest"> بهترین ها </Link></li>
                            </ul>
                        </div>
                        <div className='mt-5'>
                            <h4 className='text-xl'>تست ها</h4>
                            <ul className='flex space-x-6 space-x-reverse'>
                                <li className='text-lg' onClick={openCloseMenu}><Link to="/sort?s=newest_test"> جدیدترین ها </Link></li>
                                <li className='text-lg' onClick={openCloseMenu}><Link to="/sort?s=monthly_test"> بهترین های ماه </Link></li>
                                <li className='text-lg' onClick={openCloseMenu}><Link to="/sort?s=bestest_test"> بهترین ها </Link></li>
                            </ul>
                        </div>
                        <div className='mt-5'>
                            <ul className='flex space-x-6 space-x-reverse'>
                                {/* <li className='text-lg' onClick={openCloseMenu}><Link to="/blog"> وبلاگ </Link></li> */}
                                {/* <li className='text-lg' onClick={openCloseMenu}><Link to="/guide"> راهنما </Link></li> */}
                                <li className='text-lg' onClick={openCloseMenu}><Link to="/contact"> تماس با ما </Link></li>
                            </ul>
                        </div>
                    </div>

                </nav>

                {/* <LoadingScreen /> */}

            </header>
        </React.Fragment>
    );
}

export default Header;