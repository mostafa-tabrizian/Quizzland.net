import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from "react-helmet";

import { log } from './base'
import Search from './search'

import '/static/css/style.css'

const logo = '../images/Q-small.png'
const nightModeIcon = '../images/lightMode.png'

const Header = (props) => {
    const [categoryNavigationOpen, setCategoryNavigationOpen] = useState(false)
    const [quizNavigationOpen, setQuizNavigationOpen] = useState(false)
    const [pointyNavigationOpen, setPointyNavigationOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [nightMode, setNightMode] = useState(true)

    useEffect(() => {
        componentChangeDetector()
    })

    useEffect(() => {

        if (nightMode) {
            if (localStorage.getItem('lightMode') !== 'true') {
                require('/static/css/nightTheme.css')
            }
        }
    }, [nightMode])
    
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
            setNightMode(false)
        } else {
            setNightMode(true)
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
        

            <header className="header pos-rel">
            
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
                        {
                            props.linkType == 'Link' &&
                            <Link to="/" className='header__logo flex flex-jc-sb flex-ai-c hideForDesktop'>
                                <img src={logo} alt="کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشناسی" />
                                <span>uizzland</span>
                            </Link>
                        }
                        {
                            props.linkType == 'Hot' &&
                            <a className="header__logo flex flex-jc-sb flex-ai-c hideForDesktop" href="/">
                                <img src={logo} alt="کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشناسی" />
                                <span>uizzland</span>
                            </a>
                        }
                    </div>

                    <div className={`header__links pos-rel ${props.colorOfHeader} hideForMobile hoverAnimation flex flex-ai-c`}>
                        {
                            props.linkType == 'Link' &&
                            <Link className="header__logo flex flex-jc-sb flex-ai-c" to="/">
                                <span>uizzland</span>
                                <img src={logo} alt="کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشناسی" />
                            </Link>
                        }

                        {
                            props.linkType == 'Hot' &&
                            <a className="header__logo flex flex-jc-sb flex-ai-c" href="/">
                                <span>uizzland</span>
                                <img src={logo} alt="کوییزلند | کوییزلند بهترین وب سایت کوییز های سرگرمی مانند کوییز های سلبریتی ها، فیلم و سریال و کوییز های روانشناسی و خودشناسی" />
                            </a>
                        }

                        <button className='header__btn' onClick={openCloseCategoryNavigation}>کتگوری‌ ها</button>
                        <button className="header__btn" onClick={openCloseQuizNavigation}>کویز ها</button>
                        <button className="header__btn" onClick={openClosePointyNavigation}>تست ها</button>
                        {
                            props.linkType == 'Link' &&
                            <Link to="/blog">وبلاگ</Link>
                        }
                        {
                            props.linkType == 'Hot' &&
                            <a href="/blog">وبلاگ</a>
                        }
                        {
                            nightMode &&
                            <div className="nightMode__container" title="تبدیل به حالت شب/روز">
                                <button onClick={nightModeTurnOnOff} className='nightMode' style={nightModeIconChanger()} type="button" aria-label="Night Mode De-Activator"></button>
                            </div>
                        }
                    </div>

                    <Search/>

                    <ul className={`header__categories ${props.colorOfHeader} subHeader pos-abs pointerOff tx-al-r ${categoryNavigationOpen ? 'subHeader__open' : ''}`}>
                        <li><a href="/category/movie-series">🎬 فیلم و سریال</a></li>
                        <li><a href="/category/celebrity">✨ سلبریتی</a></li>
                        <li><a href="/category/psychology">🧠 روانشناسی</a></li>
                    </ul>
                    {
                        props.linkType == 'Link' &&
                        <ul className={`header__quizzes ${props.colorOfHeader} subHeader pos-abs pointerOff tx-al-r ${quizNavigationOpen ? 'subHeader__open' : ''}`}>
                            <li><Link to="/sort?q=newest">⏳ جدیدترین ها</Link></li>
                            <li><Link to="/sort?q=monthlyBestest">👑 بهترین های ماه</Link></li>
                            <li><Link to="/sort?q=bestest">👑 بهترین ها</Link></li>
                        </ul>
                    }
                    {
                        props.linkType == 'Hot' &&
                        <ul className={`header__quizzes ${props.colorOfHeader} subHeader pos-abs pointerOff tx-al-r ${quizNavigationOpen ? 'subHeader__open' : ''}`}>
                            <li><a href="/sort?q=newest">⏳ جدیدترین ها</a></li>
                            <li><a href="/sort?q=monthlyBestest">👑 بهترین های ماه</a></li>
                            <li><a href="/sort?q=bestest">👑 بهترین ها</a></li> 
                        </ul> 
                    }
                    {
                        props.linkType == 'Link' &&
                        <ul className={`header__pointy ${props.colorOfHeader} subHeader pos-abs pointerOff tx-al-r ${pointyNavigationOpen ? 'subHeader__open' : ''}`}>
                            <li><Link to="/sort?q=newest_test">⏳ جدیدترین ها</Link></li>
                            <li><Link to="/sort?q=monthlyBestest_test">👑 بهترین های ماه</Link></li>
                            <li><Link to="/sort?q=bestest_test">👑 بهترین ها</Link></li>
                        </ul>
                    }
                    {
                        props.linkType == 'Hot' &&
                        <ul className={`header__pointy ${props.colorOfHeader} subHeader pos-abs pointerOff tx-al-r ${pointyNavigationOpen ? 'subHeader__open' : ''}`}>
                            <li><a href="/sort?q=newest_test">⏳ جدیدترین ها</a></li>
                            <li><a href="/sort?q=monthlyBestest_test">👑 بهترین های ماه</a></li>
                            <li><a href="/sort?q=bestest_test">👑 بهترین ها</a></li>
                        </ul>
                    }

                    {/* Menu */}
                    <button type="button" onClick={openCloseMenu} className={`header__menu__openBtn header__btn pos-abs ${props.colorOfHeader} hideForDesktop`} aria-label="Menu Button">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    
                    <div className={`header__menu pos-fix tx-al-r hideForDesktop ${menuOpen ? '' : 'slideMenu-hide'}`}>
                        <button onClick={openCloseMenu} className="header__btn-bg pos-abs header__menu__closeBtn" aria-label="Close Menu Button"></button>
                        <div className="header__menu__inner grid grid-jc-c">
                            <div className="header__menu__inner__category">
                                <h4>کتگوری ها</h4>
                                <ul>
                                    <li><a href="/category/movie-series">فیلم و سریال 🎬</a></li>
                                    <li><a href="/category/celebrity">سلبریتی ✨</a></li>
                                    <li><a href="/category/psychology">روانشناسی 🧠</a></li>
                                </ul>
                            </div>
                            <div className="header__menu__inner__nav">
                                <h4>کویز ها</h4>
                                {
                                    props.linkType == 'Link' &&
                                    <ul className="header__menu__inner__quizzes tx-al-r">
                                        <li><Link onClick={openCloseMenu} to="/sort?q=newest">جدیدترین ها</Link></li>
                                        <li><Link onClick={openCloseMenu} to="/sort?q=monthlyBestest">بهترین های ماه</Link></li>
                                        <li><Link onClick={openCloseMenu} to="/sort?q=bestest">بهترین ها</Link></li>
                                    </ul>
                                }
                                {
                                    props.linkType == 'Hot' &&
                                    <ul className={`header__menu__inner__quizzes tx-al-r`}>
                                        <li><a onClick={openCloseMenu} href="/sort?q=newest">جدیدترین ها</a></li>
                                        <li><a onClick={openCloseMenu} href="/sort?q=monthlyBestest">بهترین های ماه</a></li>
                                        <li><a onClick={openCloseMenu} href="/sort?q=bestest">بهترین ها</a></li>
                                    </ul>

                                }
                                <h4 className='space-med'>تست ها</h4>
                                {
                                    props.linkType == 'Link' &&
                                    <ul className="header__menu__inner__quizzes tx-al-r">
                                        <li><Link onClick={openCloseMenu} to="/sort?q=newest_test">جدیدترین ها</Link></li>
                                        <li><Link onClick={openCloseMenu} to="/sort?q=monthlyBestest_test">بهترین های ماه</Link></li>
                                        <li><Link onClick={openCloseMenu} to="/sort?q=bestest_test">بهترین ها</Link></li>
                                    </ul>
                                }
                                {
                                    props.linkType == 'Hot' &&
                                    <ul className={`header__menu__inner__quizzes tx-al-r`}>
                                        <li><a href="/sort?q=newest">جدیدترین ها</a></li>
                                        <li><a href="/sort?q=monthlyBestest">بهترین های ماه</a></li>
                                        <li><a href="/sort?q=bestest">بهترین ها</a></li>
                                    </ul>

                                }
                            </div>
                            <div className="header__menu__inner__other">
                                {
                                    props.linkType == 'Link' &&
                                    <ul>
                                        <li><Link onClick={openCloseMenu} to="/blog">وبلاگ</Link></li>
                                        <li><Link onClick={openCloseMenu} to="/guide">راهنما</Link></li>
                                        <li><Link onClick={openCloseMenu} to="/contact">تماس با ما</Link></li>

                                        {/* Night Mode */}
                                        {nightMode &&
                                            <div className="nightMode__container" title="تبدیل به حالت شب و بالعکس">
                                                <button onClick={nightModeTurnOnOff} className='nightMode' style={nightModeIconChanger()} type="button" aria-label="Night Mode De-Activator"></button>
                                            </div>
                                        }   
                                    </ul>
                                }
                                {
                                    props.linkType == 'Hot' &&
                                    <ul>
                                        <li><a onClick={openCloseMenu} href="/blog">وبلاگ</a></li>
                                        <li><a onClick={openCloseMenu} href="/guide">راهنما</a></li>
                                        <li><a onClick={openCloseMenu} href="/contact">تماس با ما</a></li>

                                        {/* Night Mode */}
                                        {nightMode &&
                                            <div className="nightMode__container" title="تبدیل به حالت شب و بالعکس">
                                                <button onClick={nightModeTurnOnOff} className='nightMode' style={nightModeIconChanger()} type="button" aria-label="Night Mode De-Activator"></button>
                                            </div>
                                        }   
                                    </ul>
                                }

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