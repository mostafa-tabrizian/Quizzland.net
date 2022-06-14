import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from "react-helmet";
import { Popover } from 'antd';

import { log } from './base'
import Search from './search'
import axiosInstance from '../components/axiosApi'

const Header = () => {
    const [categoryNavigationOpen, setCategoryNavigationOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [userProfile, setUserProfile] = useState(null)

    const mobileSearchInput = useRef()

    useEffect(() => {
        componentChangeDetector()
    })

    useEffect(() => {
        fetchUserProfile()
    }, [])

    const fetchUserProfile = async () => {
        const now = new Date().getTime()
        const username = localStorage.getItem('username')
        const localRefreshToken = localStorage.getItem('refresh_token')
        
        if (username !== 'default' && localRefreshToken) {
            await axiosInstance.get(`/api/user/?username=${username}&timestamp=${now}`)
                .then( async res => {
                    const user = res.data[0]

                    log(localRefreshToken == user.refreshToken)
                    
                    if (localRefreshToken !== user.refreshToken) {
                        await axiosInstance.post('/api/token/refresh/', {refresh: localRefreshToken})
                            .then(res => {
                                log(res.res)
                                localStorage.setItem('access_token', res.data.access);
                                localStorage.setItem('refresh_token', res.data.refresh);
                                axiosInstance.defaults.headers['Authorization'] = "JWT " + res.data.access;
                                originalRequest.headers['Authorization'] = "JWT " + res.data.access;
                            })
                    } else {
                        log(user)
                        setUserProfile(user)
                    }
                })
        }
    }

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

            <header className='mb-10 relative z-10 bg-[#0000008f] p-4 rounded-md backdrop-blur-md'>
                <div>
                    <div className='hidden md:flex justify-center items-center'>
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

                    <div className="header text-xl flex md:grid md:grid-cols-3 justify-between md:max-w-[85%] relative md:mx-auto md:p-4 py-4">
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

                        <div className='flex items-center md:hidden'>
                            <Popover placement="bottomRight" title='' content={searchInputMobile} trigger="click">
                                <button className='flex header__btn items-center' type="button">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </Popover>

                            <button type="button" onClick={openCloseMenu} className={`header__btn ml-5 header__white`} aria-label="Menu Button">
                                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <line x1="3" y1="12" x2="21" y2="12" />  <line x1="3" y1="6" x2="21" y2="6" />  <line x1="3" y1="18" x2="21" y2="18" /></svg>
                            </button>
                        </div>

                        <Search />

                        <div className={`hidden md:flex md:justify-center items-center`}>
                            <div className="md:space-x-7">
                                {/* <button className="header__btn">
                                    <Link to="/blog"> وبلاگ </Link>
                                </button> */}
                                {/* <button className="header__btn" onClick={openClosePointyNavigation}>تست ها</button>
                                <button className="header__btn" onClick={openCloseQuizNavigation}>کویز ها</button> */}
                                <Link to='/sort?s=newest' className='text-xl'>کوییز و تست ها</Link>
                                <button className='header__btn' onClick={openCloseCategoryNavigation}>کتگوری ها</button>
                            </div>
                        </div>

                        <div className='space-x-5 md:justify-center md:flex hidden'>
                            {
                                userProfile ?
                                    <Link to='/profile'>
                                        <div className='flex items-center'>
                                            <svg class="h-10 w-10 ml-3 text-[#ac272e]"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            <div className='flex space-x-1 space-x-reverse'>
                                                <div>
                                                    {userProfile.first_name}
                                                </div>
                                                <div>
                                                    {userProfile.last_name}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                :
                                <React.Fragment>
                                    <Link to='/login'>ورود</Link>
                                    <Link to='/register'>ثبت نام</Link>
                                </React.Fragment>
                            }
                        </div>

                        <ul className={`right-[12rem] header__white subHeader top-20 bg-gradient-to-tr from-[#6d0f12] to-[#b82633] rounded-2xl px-5 py-7 line absolute text-right ${categoryNavigationOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <li><Link to="/category/movie-&-series">فیلم و سریال 🎬</Link></li>
                            <li><Link to="/category/celebrity">سلبریتی ✨</Link></li>
                            <li><Link to="/category/psychology">روانشناسی 🧠</Link></li>
                        </ul>

                        {/* Menu */}

                        <div className={`header__menu fixed text-right h-[20rem] w-[100%]
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
                    </div>
                </div>
                
                <div className='block md:hidden'>
                    {
                        userProfile ?
                            <Link to='/profile'>
                                <div className='flex items-center'>
                                    <svg class="h-10 w-10 ml-3 text-[#ac272e]"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <div className='flex space-x-1 space-x-reverse'>
                                        <div>
                                            {userProfile.first_name}
                                        </div>
                                        <div>
                                            {userProfile.last_name}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        :
                        <React.Fragment>
                            <Link to='/login'>ورود</Link>
                            <Link to='/register'>ثبت نام</Link>
                        </React.Fragment>
                    }
                </div>

            </header>

        </React.Fragment>
    );
}

export default Header;