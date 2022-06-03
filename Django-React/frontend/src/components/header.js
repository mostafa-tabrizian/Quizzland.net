import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from "react-helmet";
import { Popover } from 'antd';

import { log } from './base'
import Search from './search'

const Header = () => {
    const [categoryNavigationOpen, setCategoryNavigationOpen] = useState(false)
    const [quizNavigationOpen, setQuizNavigationOpen] = useState(false)
    const [pointyNavigationOpen, setPointyNavigationOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    const mobileSearchInput = useRef()

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

    const searchInputMobile = (
        <input
            type='text'
            className={`text-right bg-transparent text-lg outline-none text-black`}
            ref={mobileSearchInput}
            onKeyPress={e => { if (e.key == 'Enter') { window.open(`/search?q=${e.target.value}`, '_blank') } }}
        />
    )

    return (
        <React.Fragment>

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

                <script>
                    {`
                        (function(h,o,t,j,a,r){
                            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                            h._hjSettings={hjid:2587894,hjsv:6};
                            a=o.getElementsByTagName('head')[0];
                            r=o.createElement('script');r.async=1;
                            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                            a.appendChild(r);
                        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                    `}
                </script>
            </Helmet>

            <header className="header text-xl z-10 mb-10 flex md:justify-between max-w-[110rem] relative md:m-auto p-4">

                <div>
                    <Link to="/" className='flex header__logo justify-between items-center md:hidden'>
                        <span className='bloodRiver ml-1 text-[1.6rem]'>uizzland</span>
                        <img
                            src='/static/img/Q-small.png'
                            alt='کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشناسی'
                            width={24}
                            height={35}
                        />
                    </Link>
                </div>

                <div className='absolute right-6 flex items-center'>
                    <Popover placement="bottomRight" title='' content={searchInputMobile} trigger="click">
                        <button className='flex header__btn md:hidden items-center' type="button">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </Popover>

                    <button type="button" onClick={openCloseMenu} className={`header__btn ml-5 header__white md:hidden`} aria-label="Menu Button">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <line x1="3" y1="12" x2="21" y2="12" />  <line x1="3" y1="6" x2="21" y2="6" />  <line x1="3" y1="18" x2="21" y2="18" /></svg>
                    </button>
                </div>

                <Search />

                <div className={`md:space-x-5 py-5 mr-6 z-10 relative header__white hidden md:flex items-center`}>
                    <div className="md:space-x-7 mr-4">
                        {/* <button className="header__btn">
                            <Link to="/blog"> وبلاگ </Link>
                        </button> */}
                        {/* <button className="header__btn" onClick={openClosePointyNavigation}>تست ها</button>
                        <button className="header__btn" onClick={openCloseQuizNavigation}>کویز ها</button> */}
                        <Link to='/sort?s=newest' className='text-xl'>کوییز و تست ها</Link>
                        <button className='header__btn' onClick={openCloseCategoryNavigation}>کتگوری ها</button>
                    </div>

                    <Link to="/" className="flex header__logo justify-between items-center">
                        <span className='bloodRiver ml-1 text-[1.6rem]'>uizzland</span>
                        <img
                            src='/static/img/Q-small.png'
                            alt='کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشsearchناسی'
                            width={24}
                            height={35}
                        />
                    </Link>

                </div>

                <ul className={`right-[12rem] header__white subHeader top-20 bg-gradient-to-tr from-[#6d0f12] to-[#b82633] rounded-2xl px-5 py-7 z-10 line absolute text-right ${categoryNavigationOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <li><Link to="/category/movie-&-series">فیلم و سریال 🎬</Link></li>
                    <li><Link to="/category/celebrity">سلبریتی ✨</Link></li>
                    <li><Link to="/category/psychology">روانشناسی 🧠</Link></li>
                </ul>

                <ul className={`right-[19rem] header__white subHeader top-20 bg-gradient-to-tr from-[#6d0f12] to-[#b82633] rounded-2xl px-5 py-7 z-10 line absolute text-right ${quizNavigationOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <li><a href="/sort?s=newest"> ⏳ جدیدترین </a></li>
                    <li><a href="/sort?s=trend"> 👑 محبوب ترین </a></li>
                    <li><a href="/sort?s=views"> 👑 پربازدیدترین </a></li>
                </ul>

                {/* Menu */}

                <div className={`header__menu fixed text-right z-20 h-[20rem] w-[100%]
                                bg-[#000000b0] backdrop-blur-xl top-0 right-0
                                rounded-[40px] md:hidden ${menuOpen ? '' : 'slideMenu-hide'}
                                pr-8 pt-5`}>
                    <button onClick={openCloseMenu} className="header__menu__closeBtn" aria-label="Close Menu Button">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>

                    <div className='mt-5'>
                        <h4 className='text-xl'>کتگوری ها</h4>
                        <ul className='flex space-x-6 space-x-reverse'>
                            <li className='text-lg' onClick={openCloseMenu}><Link to="/category/movie-&-series">فیلم و سریال 🎬</Link></li>
                            <li className='text-lg' onClick={openCloseMenu}><Link to="/category/celebrity">سلبریتی ✨</Link></li>
                            <li className='text-lg' onClick={openCloseMenu}><Link to="/category/psychology">روانشناسی 🧠</Link></li>
                        </ul>
                    </div>
                    <div className='mt-5'>
                        <h4 className='text-xl'>کوییز و تست ها</h4>
                        <ul className='flex space-x-6 space-x-reverse'>
                            <li className='text-lg' onClick={openCloseMenu}><Link to="/sort?s=newest"> جدیدترین </Link></li>
                            <li className='text-lg' onClick={openCloseMenu}><Link to="/sort?s=trend"> محبوب ترین </Link></li>
                            <li className='text-lg' onClick={openCloseMenu}><Link to="/sort?s=views"> پربازدیدترین </Link></li>
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

                {/* <LoadingScreen /> */}

            </header>
        </React.Fragment>
    );
}

export default Header;