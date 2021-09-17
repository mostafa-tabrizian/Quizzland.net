import React, { useState, useEffect } from 'react'

import { log } from './base'
import Search from './search'

import '/static/css/style.css'

const logo = '/static/img/Q-small.png'
const nightModeIcon = '/static/img/lightMode.png'

const Header = (props) => {
    const [categoryNavigationOpen, setCategoryNavigationOpen] = useState(false)
    const [quizNavigationOpen, setQuizNavigationOpen] = useState(false)
    const [pointyNavigationOpen, setPointyNavigationOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [showNightModeButton, setShowNightModeButton] = useState(true)

    useEffect(() => {
        componentChangeDetector()
    })
    
    // if (navigator.userAgent.indexOf("Firefox") !== -1 ) {
    //     if (localStorage.getItem('alertUFHB') !== 'true') {
    //         alert('لطفا از مرورگر کروم یا غیره استفاده کنید \n در مرورگر شما (فایرفاکس) برخی دیزاین ها قابل اجرا نیست')
    //         localStorage.setItem('alertUFHB', 'True')
    //     }
    // }

    const componentChangeDetector = () => {
        (function(history){

            let pushState = history.pushState;
            history.pushState = function() {
                pushState.apply(history, arguments);
            };

            checkIfShouldShowNightModeBtn()

        })(window.history);
    }

    const checkIfShouldShowNightModeBtn = () => {
        const pageUrl = window.location.pathname.split('/')

        if (pageUrl.includes('quiz')) {
            setShowNightModeButton(false)
        } else {
            setShowNightModeButton(true)
            if (localStorage.getItem('lightMode') !== 'true') {
                require('/static/css/nightTheme.css')
            }
        }
    }

    const nightModeTurnOnOff = () => {

        if (localStorage.getItem('lightMode') === 'true') {
            localStorage.setItem('lightMode', false)
            window.location.reload();
        } else {
            require('/static/css/nightTheme.css')
            localStorage.setItem('lightMode', true)
            window.location.reload();
        }
    }

    const nightModeIconChanger = () => {
        if (localStorage.getItem('lightMode') === 'true') {
            return {
                background: `url('${nightModeIcon}') no-repeat center center`
            }
        }
    }

    const openCloseMenu = () => {
        setMenuOpen(menuOpen ? false : true)
    }

    const openCloseCategoryNavigation = () => {
        setCategoryNavigationOpen(categoryNavigationOpen ? false : true)

        if (quizNavigationOpen) {
            setQuizNavigationOpen(false)
        }
    }
    
    const openCloseQuizNavigation = () => {
        setQuizNavigationOpen(quizNavigationOpen ? false : true)

        if (categoryNavigationOpen) {
            setCategoryNavigationOpen(false)
        }
    }

    const openClosePointyNavigation = () => {
        setPointyNavigationOpen(pointyNavigationOpen ? false : true)
        // close every other panel
        setCategoryNavigationOpen(false)
        setQuizNavigationOpen(false)
    }

    return (
        <React.Fragment>

            <header className="header pos-rel">

                <nav className="flex flex-ai-c flex-jc-sb">

                    <div className="flex flex-ai-c">
                        <a href="/" className='header__logo flex flex-jc-sb flex-ai-c hideForDesktop'>
                            <img src={logo} alt="کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشناسی" />
                            <span>uizzland</span>
                        </a>
                        <Search />
                    </div>

                    <div className={`header__links pos-rel ${props.colorOfHeader} hideForMobile hoverAnimation flex flex-ai-c`}>
                        <a className="header__logo flex flex-jc-sb flex-ai-c" href="/">
                            <span>uizzland</span>
                            <img src={logo} alt="کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشناسی" />
                        </a>
                        <button className='header__btn' onClick={openCloseCategoryNavigation}>کتگوری‌ ها</button>
                        <button className="header__btn" onClick={openCloseQuizNavigation}>کویز ها</button>
                        <button className="header__btn" onClick={openClosePointyNavigation}>تست ها</button>
                        <a href="/blog">وبلاگ</a>
                        <a href="/guide">راهنما</a>
                        <a href="/contact">تماس با ما</a>

                        {
                            showNightModeButton &&
                            <div className="nightMode__container" title="تبدیل به حالت شب/روز">
                                <button onClick={nightModeTurnOnOff} className='nightMode' style={nightModeIconChanger()} type="button" aria-label="Night Mode De-Activator"></button>
                            </div>
                        }
                    </div>

                    <ul className={`header__categories ${props.colorOfHeader} subHeader pos-abs pointerOff tx-al-r ${categoryNavigationOpen ? 'subHeader__open' : ''}`}>
                        <li><a href="/category/movie-series">🎬 فیلم و سریال</a></li>
                        <li><a href="/category/celebrity">✨ سلبریتی</a></li>
                        <li><a href="/category/psychology">🧠 روانشناسی</a></li>
                    </ul>
                    <ul className={`header__quizzes ${props.colorOfHeader} subHeader pos-abs pointerOff tx-al-r ${quizNavigationOpen ? 'subHeader__open' : ''}`}>
                        <li><a href="/sort?q=newest">⏳ جدیدترین ها</a></li>
                        <li><a href="/sort?q=monthlyBestest">👑 بهترین های ماه</a></li>
                        <li><a href="/sort?q=bestest">👑 بهترین ها</a></li>
                    </ul>
                    <ul className={`header__pointy ${props.colorOfHeader} subHeader pos-abs pointerOff tx-al-r ${pointyNavigationOpen ? 'subHeader__open' : ''}`}>
                        <li><a href="/sort?q=newest_test">⏳ جدیدترین ها</a></li>
                        <li><a href="/sort?q=monthlyBestest_test">👑 بهترین های ماه</a></li>
                        <li><a href="/sort?q=bestest_test">👑 بهترین ها</a></li>
                    </ul>

                    {/* Menu */}
                    <button type="button" onClick={openCloseMenu} className={`header__menu__openBtn header__btn pos-abs ${props.colorOfHeader} hideForDesktop`} aria-label="Menu Button">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    
                    <div className={`header__menu pos-fix tx-al-r hideForDesktop ${menuOpen ? '' : 'slideMenu-hide'}`}>
                        <button onClick={openCloseMenu} className="header__btn-bg pos-abs header__menu__closeBtn" aria-label="Close Menu Button"></button>
                        <div className="header__menu__inner grid grid-jc-c">
                            <div className={`header__menu__inner__category ${props.colorOfHeader}`}>
                                <h4>کتگوری ها</h4>
                                <ul>
                                    <li><a href="/category/movie-series">🎬 فیلم و سریال</a></li>
                                    <li><a href="/category/celebrity">✨ سلبریتی</a></li>
                                    <li><a href="/category/psychology">🧠 روانشناسی</a></li>
                                </ul>
                            </div>
                            <div className={`header__menu__inner__nav ${props.colorOfHeader}`}>
                                <h4>کویز ها</h4>
                                <ul className={`header__menu__inner__quizzes tx-al-r`}>
                                    <li><a href="/sort?q=newest">جدیدترین ها</a></li>
                                    <li><a href="/sort?q=bestest">بهترین ها</a></li>
                                    <li><a href="/sort?q=monthlyBestest">بهترین های ماه</a></li>
                                    <li><a href="/#sort">مرتب شده</a></li>
                                </ul>
                                <h4 className='space-med'>تست ها</h4>
                                <ul className="header__menu__inner__quizzes tx-al-r">
                                    <li><a href="/sort?q=newest">جدیدترین ها</a></li>
                                    <li><a href="/sort?q=monthlyBestest">بهترین های ماه</a></li>
                                    <li><a href="/sort?q=bestest">بهترین ها</a></li>
                                </ul>
                            </div>
                            <div className="header__menu__inner__other">
                                <ul className={props.colorOfHeader}>
                                    <li><a href="/blog">وبلاگ</a></li>
                                    <li><a href="/guide">راهنما</a></li>
                                    <li><a href="/contact">تماس با ما</a></li>

                                    {
                                        showNightModeButton &&
                                        <div className="nightMode__container" title="تبدیل به حالت شب و بالعکس">
                                            <button onClick={nightModeTurnOnOff} className='nightMode' style={nightModeIconChanger()} type="button" aria-label="Night Mode De-Activator"></button>
                                        </div>
                                    }   
                                </ul>
                            </div>
                        </div>
                    </div>

                </nav>

                {/* <LoadingScreen /> */}

            </header>
        </React.Fragment>
    );
}
 
export default Header;