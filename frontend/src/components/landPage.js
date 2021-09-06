import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import rateLimit from 'axios-rate-limit';
import { Helmet } from "react-helmet";
import Header from './header'

import { log } from './base'
import QuizContainerWithoutViews from './quizContainerWithoutViews'
import QuizPointyContainer from './quizPointyContainer'
import QuizIndex from './quizIndex'
import SortIndex from './sortIndex'
import LoadingScreen from './loadingScreen'

const landPagePath = '/static/img/landPage-path.png'
const landPagePath_light = '/static/img/landPage-path-light.png'
const Q = '/static/img/Q.png'
const QBubbles = '/static/img/QBubbles.png'
const category_celebrity = '/static/img/category-celebrity.jpg'
const category_movieSeries = '/static/img/category-movieSeries.jpg'
const category_psychology = '/static/img/category-psychology.jpg'

const axiosLimited = rateLimit(axios.create(), { maxRequests: 15, perMilliseconds: 1000, maxRPS: 2 })

const Index = () => {
    const [recommendedQuizzes, setRecommendedQuizzes] = useState([])
    const [newestCelebrityQuizzes, setNewestCelebrityQuizzes] = useState([])
    const [newestMovieSeriesQuizzes, setNewestMovieSeriesQuizzes] = useState([])
    const [newestPsychologyPointyQuizzes, setNewestPsychologyPointyQuizzes] = useState([])

    const [monthlyBestQuizzes, setMonthlyBestQuizzes] = useState([])
    const [bestQuizzes, setBestQuizzes] = useState([])

    const [monthlyCelebrityBestQuizzes, setMonthlyCelebrityBestQuizzes] = useState([])
    const [bestCelebrityQuizzes, setBestCelebrityQuizzes] = useState([])
    const [monthlyMovieSeriesBestQuizzes, setMonthlyMovieSeriesBestQuizzes] = useState([])
    const [bestMovieSeriesQuizzes, setBestMovieSeriesQuizzes] = useState([])
    const [monthlyPsychologyBestQuizzes, setMonthlyPsychologyBestQuizzes] = useState([])
    const [bestPsychologyQuizzes, setBestPsychologyQuizzes] = useState([])

    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    
    useEffect(() => {
        landPagePathSelector()
        grabData()
        recommendationQuiz()
        setLoadState(true)
        setContentLoaded(true)
        if (document.getElementById('html')) {
            document.getElementById('html').style='background: None'
        }
    }, [])

    const grabAndSortMostVisitedCategories = (interest) => {
        if (interest !== null) {
            let hightestVisitedCategory = [];

            for (let category in interest) {
                hightestVisitedCategory.push([category, interest[category]]);
            }
            
            hightestVisitedCategory.sort(function(a, b) {
                return b[1] - a[1];
            });

            return hightestVisitedCategory
        }
    }

    const recommendationQuiz = async () => {
        try {
            const interest = JSON.parse(localStorage.getItem('interest'))['categoryWatchedCounter']
            const hightestVisitedCategory = grabAndSortMostVisitedCategories(interest)
            const top1stUserCategory = hightestVisitedCategory[0][0]
            const top2ndUserCategory = hightestVisitedCategory[1][0]
            const top3rdUserCategory = hightestVisitedCategory[2][0]
    
            let matchedQuizzes = []
    
            const search_top_1st_category = await axiosLimited.get(`/dbAPI/new_quiz/?subCategory__icontains=${top1stUserCategory}&limit=4`)
            Array.prototype.push.apply(matchedQuizzes, search_top_1st_category.data.results)
            
            const search_top_2nd_category = await axiosLimited.get(`/dbAPI/new_quiz/?subCategory__icontains=${top2ndUserCategory}&limit=2`)
            Array.prototype.push.apply(matchedQuizzes, search_top_2nd_category.data.results)
            
            const search_top_3rd_category = await axiosLimited.get(`/dbAPI/new_quiz/?subCategory__icontains=${top3rdUserCategory}&limit=2`)
            Array.prototype.push.apply(matchedQuizzes, search_top_3rd_category.data.results)
    
            const recommendedQuizzesList = () => {
                return (
                    matchedQuizzes.length >= 4 &&
                    <div className="space-med">
    
                        <div className="quizContainer__header flex flex-jc-fe flex-ai-c wrapper-med">
                            <h2>پیشنهادی های کوییزلند به شما</h2>
                        </div>
                        
                        <div>
                            <ul className="quizContainer flex flex-ai-fe wrapper-med">
                                <QuizContainerWithoutViews quizzes={matchedQuizzes} bgStyle='trans' />
                            </ul>
                        </div>
                    </div>
                )
            }
    
            setRecommendedQuizzes([])
            setRecommendedQuizzes(recommendedQuizzesList)
        } catch(e) {
            return ''
        }
    }

    const grabData = async () => {

        const new_quiz_celebrity = await axiosLimited.get('/dbAPI/new_quiz/?category__icontains=celebrity&limit=8')
        setNewestCelebrityQuizzes(new_quiz_celebrity.data.results)

        const new_quiz_movieSeries = await axiosLimited.get('/dbAPI/new_quiz/?category__icontains=movie-series&limit=8')
        setNewestMovieSeriesQuizzes(new_quiz_movieSeries.data.results)

        const new_quiz_psychology = await axiosLimited.get('/dbAPI/new_pointy_quiz/?category__icontains=psychology&limit=8')
        setNewestPsychologyPointyQuizzes(new_quiz_psychology.data.results)

        // ---------

        const monthlyBest_quiz = await axiosLimited.get('/dbAPI/monthlyBest_quiz/?limit=5')
        setMonthlyBestQuizzes(monthlyBest_quiz.data.results)

        const monthlyBest_quiz_celebrity = await axiosLimited.get('/dbAPI/monthlyBest_quiz/?category__icontains=celebrity&limit=13')
        setMonthlyCelebrityBestQuizzes(monthlyBest_quiz_celebrity.data.results)

        const monthlyBest_quiz_movieSeries = await axiosLimited.get('/dbAPI/monthlyBest_quiz/?category__icontains=movie-series&limit=13')
        setMonthlyMovieSeriesBestQuizzes(monthlyBest_quiz_movieSeries.data.results)

        const monthlyBest_pointy_quiz_psychology = await axiosLimited.get('/dbAPI/monthlyBest_pointy_quiz/?category__icontains=psychology&limit=13')
        setMonthlyPsychologyBestQuizzes(monthlyBest_pointy_quiz_psychology.data.results)

        // ---------
        
        const best_quiz = await axiosLimited.get('/dbAPI/best_quiz/?limit=5')
        setBestQuizzes(best_quiz.data.results)

        const best_quiz_celebrity = await axiosLimited.get('/dbAPI/best_quiz/?category__icontains=celebrity&limit=13')
        setBestCelebrityQuizzes(best_quiz_celebrity.data.results)

        const best_quiz_movieSeries = await axiosLimited.get('/dbAPI/best_quiz/?category__icontains=movie-series&limit=13')
        setBestMovieSeriesQuizzes(best_quiz_movieSeries.data.results)

        const best_pointy_quiz_psychology = await axiosLimited.get('/dbAPI/best_pointy_quiz/?category__icontains=psychology&limit=13')
        setBestPsychologyQuizzes(best_pointy_quiz_psychology.data.results) 
    }

    const landPagePathSelector = () => {
        if (localStorage.getItem('lightMode') === 'true') {
            return {
                background: `url('${landPagePath_light}')`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top center',
                backgroundSize: 'cover'
            }
        } else {
            return {
                background: `url('${landPagePath}')`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top center',
                backgroundSize: 'cover'
            }
        }
    }

    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header />

            <Helmet>
                <title>کوییزلند | بهترین و جدیدترین کوییز، تست و تریویا ها</title>
                <meta name="description" content="سایت کوییزلند وب‌ سایت کوییز و تست برای کتگوری های متنوع همچون سلبریتی , فیلم و سریال,  گیمینگ و تست های روانشناسی معتبر از سایت های رسمی و کوییزهای باحال دیگه" />
                <meta name="keywords" content="کوییز, سایت بازی کوییز, بازی کوییز, بازی کوییز, کوییزلند, کوییزلند, کوییز, کوییز های فیلم و سریال, کوییز های سلبریتی و آدم های معروف, خواننده, بازیگر, کوییز های گیمینگ, تست های روانشناسی معتبر, کوییز های باحال, کوییز های فان, بهترین وب سایت کوییز, بهترین وب سایت تست، کوییز تیلور سویفت، کوییز فرندز، کوییز مارول" />
                <link rel='canonical' href='https://quizzland.net/' />
            </Helmet>

            <div className="hero flex flex-jc-c flex-ai-c">
                <div className="hero__path pos-abs" style={landPagePathSelector()}></div>
                <div className='hero__logo tx-al-c hideForMobile'>
                    <img src={Q} className='Q' alt="لوگوی کوییزلند" />
                    <img src={QBubbles} className='Q__Bubbles' alt="لوگوی کوییزلند" />
                </div>
                <div className='hero__start tx-al-r'>
                    <h1>اینجا کوییزلندِ</h1>
                    <h2>جایی که میتونی خودت رو به عنوان فن واقعی به بقیه ثابت کنی پس اگر آماده ای 😎 </h2>
                    <button onClick={() => {document.getElementById('category').scrollIntoView()}} className='flex-ai-c btn'><span></span> بزن بریم </button>
                </div>
            </div>

            <h2 className="category__title tx-al-r wrapper-med">کتگوری</h2>

            <div className="category flex flex-ai-c flex-jc-fe wrapper-med" id="category">
                <a href="/category/psychology?q=newest">
                    <img src={category_psychology} alt="کتگوری مختص تست های روانشناسی، شخصیت از منابع معتبر و بعضی برای سرگرمی خود" />
                    <span className='tx-al-c'>🧠 روانشناسی</span>
                </a>
                <a href="/category/movie-series?q=newest">
                        <img src={category_movieSeries} alt="کوییز کتگوری دسته ی فیلم و سریال مربوط به سوالات در مورد کارکتر شخصیت فیلم ها یا داستان آن" />
                        <span className='tx-al-c'>🎬 فیلم و سریال </span>
                </a>
                <a href="/category/celebrity?q=newest">
                    <img src={category_celebrity} alt="کوییز های کتگوری دسته ی سلبریتی مربوط به افراد مشهور مانند بازیگر و خواننده که مربوط به سوالات در مورد اطلاعات شخصی آنها یا فعالیت آنهاست" />
                    <span className='tx-al-c'>✨ سلبریتی </span>
                </a>
            </div>

            {recommendedQuizzes}

            <div className="space-med">

                <div className="quizContainer__header flex flex-ai-c wrapper-med">
                    <a className="btn" href="sort?q=newest&c=celebrity">... نمایش بیشتر </a>
                    <h2>سلبریتی</h2>
                </div>

                <ul className={`quizContainer flex wrapper-med ${contentLoaded && 'noVis'}`}>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                </ul>

                <ul className="quizContainer flex flex-ai-fe wrapper-med">
                    <QuizContainerWithoutViews quizzes={newestCelebrityQuizzes} bgStyle='trans' />
                </ul>

            </div>

            <div className="space-med">

                <div className="quizContainer__header flex flex-ai-c wrapper-med">
                    <a className="btn" href="sort?q=newest&c=movie-series">... نمایش بیشتر </a>
                    <h2>فیلم و سریال</h2>
                </div>

                <ul className={`quizContainer flex wrapper-med ${contentLoaded && 'noVis'}`}>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                </ul>

                <ul className="quizContainer flex flex-ai-fe wrapper-med">
                    <QuizContainerWithoutViews quizzes={newestMovieSeriesQuizzes} bgStyle='trans' />
                </ul>

            </div>

            <div className="space-med">

                <div className="quizContainer__header flex flex-ai-c wrapper-med">
                    <a className="btn" href="sort?q=newest&c=psychology">... نمایش بیشتر </a>
                    <h2>روانشناسی</h2>
                </div>

                <ul className={`quizContainer flex wrapper-med ${contentLoaded && 'noVis'}`}>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                </ul>

                <ul className="quizContainer flex flex-ai-fe wrapper-med">
                    <QuizPointyContainer quizzes={newestPsychologyPointyQuizzes} bgStyle='trans' />
                </ul>

            </div>

            <SortIndex />

            <div className="sort pos-rel flex flex-jc-c space-l">
                
                <div className="sort__all fadeIn">
                    <div className="sort__container flex flex-jc-c">
                        <div className="sort-monthlyViews">
                            <h2 className="tx-al-c">پر بازدید ترین های این ماه</h2>

                            <ul className={`sort__style quizContainer ${contentLoaded && 'noVis'}`}>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                            </ul>

                            <ul className="sort__style">
                                <QuizIndex quizzes={monthlyBestQuizzes} />
                            </ul>

                            <Link className={`sort__more pos-abs ${contentLoaded ? '' : 'noVis'}`} to="sort?q=monthlyBestest"> ... نمایش بیشتر</Link>
                        </div>

                        <div className="sort-views">
                            <h2 className="tx-al-c">پر بازدید ترین کوییز ها</h2>

                            <ul className={`sort__style quizContainer ${contentLoaded && 'noVis'}`}>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                                <li className='skeletonLoading skeletonLoading__sortIndex'></li>
                            </ul>

                            <ul className="sort__style">
                                <QuizIndex quizzes={bestQuizzes} />
                            </ul>

                            <Link className={`sort__more pos-abs ${contentLoaded ? '' : 'noVis'}`} to="sort?q=bestest"> ... نمایش بیشتر</Link>
                        </div>
                    </div>
                </div>

                <div className="sort__celebrities fadeOut">
                    <div className="sort__container flex flex-jc-c">
                        <div className="sort-monthlyViews">
                            <h2 className="tx-al-c">پر بازدید ترین های این ماه</h2>
                            <ul className="sort__style">
                                <QuizIndex quizzes={monthlyCelebrityBestQuizzes} />
                            </ul>
                            <Link className="sort__more pos-abs" to="sort?q=monthlyBestest&c=celebrity"> ... نمایش بیشتر</Link>
                        </div>
                        <div className="sort-views">
                            <h2 className="tx-al-c">پر بازدید ترین ها</h2>
                            <ul className="sort__style">
                                <QuizIndex quizzes={bestCelebrityQuizzes} />
                            </ul>
                            <Link className="sort__more pos-abs" to="sort?q=bestest&c=celebrity"> ... نمایش بیشتر</Link>
                        </div>
                    </div>
                </div>

                <div className="sort__movieAndSeries fadeOut">
                    <div className="sort__container flex flex-jc-c">
                        <div className="sort-monthlyViews">
                            <h2 className="tx-al-c">پر بازدید ترین های این ماه</h2>
                            <ul className="sort__style">
                                <QuizIndex quizzes={monthlyMovieSeriesBestQuizzes} />
                            </ul>
                            <Link className="sort__more pos-abs" to="sort?q=monthlyBestest&c=movie-series"> ... نمایش بیشتر</Link>
                        </div>
                        <div className="sort-views">
                            <h2 className="tx-al-c">پر بازدید ترین ها</h2>
                            <ul className="sort__style">
                                <QuizIndex quizzes={bestMovieSeriesQuizzes} />
                            </ul>
                            <Link className="sort__more pos-abs" to="sort?q=bestest&c=movie-series"> ... نمایش بیشتر</Link>
                        </div>
                    </div>
                </div>

                <div className="sort__psychology fadeOut">
                    <div className="sort__container flex flex-jc-c">
                        <div className="sort-monthlyViews">
                            <h2 className="tx-al-c">پر بازدید ترین های این ماه</h2>
                            <ul className="sort__style">
                                <QuizIndex quizzes={monthlyPsychologyBestQuizzes} />
                            </ul>
                            <Link className="sort__more pos-abs" to="sort?q=monthlyBestest&c=movie-series"> ... نمایش بیشتر</Link>
                        </div>
                        <div className="sort-views">
                            <h2 className="tx-al-c">پر بازدید ترین ها</h2>
                            <ul className="sort__style">
                                <QuizIndex quizzes={bestPsychologyQuizzes} />
                            </ul>
                            <Link className="sort__more pos-abs" to="sort?q=bestest&c=psychology"> ... نمایش بیشتر</Link>
                        </div>
                    </div>
                </div>

            </div>

            {/* <adverts className="adverts adverts__bottomIndex">
                this is special adverts for landPage
            </adverts> */}

        </React.Fragment>
    );
}
 
export default Index;