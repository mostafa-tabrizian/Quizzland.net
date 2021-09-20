import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import rateLimit from 'axios-rate-limit';
import { Helmet } from "react-helmet";
import Header from './header'

import { log, isItMobile, isItDesktop, isItIPad } from './base'
import QuizContainerWithoutViews from './quizContainerWithoutViews'
import QuizPointyContainer from './quizPointyContainer'
import LoadingScreen from './loadingScreen'
import SkeletonLoading from './skeletonLoading'

const landPagePath = '/static/img/landPage-path.png'
const landPagePath_light = '/static/img/landPage-path-light.png'
const landPagePath_mobile = '/static/img/landPage-path-mobile.png'
const landPagePath_light_mobile = '/static/img/landPage-path-light-mobile.png'
const Q = '/static/img/Q.png'
const QBubbles = '/static/img/QBubbles.png'

const axiosLimited = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 1000, maxRPS: 150 })

const Index = () => {
    const [recommendedQuizzes, setRecommendedQuizzes] = useState([])

    const [newestCelebrityQuizzes, setNewestCelebrityQuizzes] = useState([])
    const [newestMovieSeriesQuizzes, setNewestMovieSeriesQuizzes] = useState([])
    const [newestPsychologyPointyQuizzes, setNewestPsychologyPointyQuizzes] = useState([])

    const [newestQuizzes, setNewestQuizzes] = useState([])
    const [monthlyBestQuizzes, setMonthlyBestQuizzes] = useState([])

    const [newestPointy, setNewestPointy] = useState([])
    const [monthlyBestestPointy, setMonthlyBestestPointy] = useState([])

    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    
    useEffect(() => {
        landPagePathSelector()
        grabData()
        recommendationQuiz()
        setLoadState(true)
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
                            <h3 className='paintBrush'>پیشنهادی های کوییزلند به شما</h3>
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
            return log('No Recommending -- New User')
        }
    }

    const grabData = async () => {
        const new_quiz_psychology = await axiosLimited.get('/dbAPI/new_pointy_quiz/?category__icontains=psychology&limit=8')
        setNewestPsychologyPointyQuizzes(new_quiz_psychology.data.results)

        const new_quiz_movieSeries = await axiosLimited.get('/dbAPI/new_quiz/?category__icontains=movie-series&limit=8')
        setNewestMovieSeriesQuizzes(new_quiz_movieSeries.data.results)

        const new_quiz_celebrity = await axiosLimited.get('/dbAPI/new_quiz/?category__icontains=celebrity&limit=8')
        setNewestCelebrityQuizzes(new_quiz_celebrity.data.results)
        
        const monthlyBest_quiz = await axiosLimited.get('/dbAPI/monthlyBest_quiz/?limit=8')
        setMonthlyBestQuizzes(monthlyBest_quiz.data.results)
        
        const new_quiz = await axiosLimited.get('/dbAPI/new_quiz/?limit=8')
        setNewestQuizzes(new_quiz.data.results)

        const new_pointy = await axiosLimited.get('/dbAPI/new_pointy_quiz/?limit=8')
        setNewestPointy(new_pointy.data.results)

        const monthlyBest_pointy = await axiosLimited.get('/dbAPI/monthlyBest_pointy_quiz/?limit=8')
        setMonthlyBestestPointy(monthlyBest_pointy.data.results)

        setContentLoaded(true)
    }

    const landPagePathSelector = () => {
        if (isItDesktop()) {
            if (localStorage.getItem('lightMode') === 'true') {
                return {
                    background: `url('${landPagePath_light}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'bottom center',
                    backgroundSize: 'cover'
                }
            } else {
                return {
                    background: `url('${landPagePath}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'bottom center',
                    backgroundSize: 'cover'
                }
            }
        }
        else {  // mobile or tablet path
            if (localStorage.getItem('lightMode') === 'true') {
                return {
                    background: `url('${landPagePath_light_mobile}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'Bottom center',
                    backgroundSize: 'cover'
                }
            } else {
                return {
                    background: `url('${landPagePath_mobile}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'Bottom center',
                    backgroundSize: 'cover'
                }
            }
        }
    }

    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header />

            <Helmet>
                <title>کوییزلند | بهترین و جدیدترین کوییز، تست و تریویا ها</title>
                <meta name="description" content="سایت کوییزلند وب‌ سایت کوییز و تست برای کتگوری های متنوع همچون سلبریتی , فیلم و سریال و تست های روانشناسی معتبر از سایت های رسمی و کوییزهای باحال دیگه" />
                <meta name="keywords" content="کوییز, سایت بازی کوییز, بازی کوییز, بازی کوییز, کوییزلند, کوییزلند, کوییز, کوییز های فیلم و سریال, کوییز های سلبریتی و آدم های معروف, خواننده, بازیگر, کوییز های تست های روانشناسی معتبر, کوییز های باحال, کوییز های فان, بهترین وب سایت کوییز, بهترین وب سایت تست، کوییز تیلور سویفت، کوییز فرندز، کوییز مارول" />
                <link rel='canonical' href='https://www.quizzland.net/' />

                <script type='application/ld+json'>
                {`
                    {
                        "@context": "https://schema.org/",
                        "@type": "WebSite",
                        "name": "کوییزلند",
                        "url": "https://quizzland.net",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://www.quizzland.net/search?s={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    }
                `}
                </script>
            </Helmet>

            <div className="hero flex flex-jc-c flex-ai-c">
                <div className="hero__path pos-abs" style={landPagePathSelector()}></div>
                {
                    !(isItMobile()) &&
                    <div className='hero__logo tx-al-c pos-rel'>
                        <img src={Q} className='Q' alt="لوگوی کوییزلند" />
                        <img src={QBubbles} className='Q__Bubbles' alt="لوگوی کوییزلند" />
                    </div>
                }
                <div className='hero__start tx-al-r'>
                    <h1>اینجا کوییزلندِ</h1>
                    <h2>جایی که میتونی خودت رو به عنوان فن واقعی به بقیه ثابت کنی پس اگر آماده ای 😎 </h2>
                    <button onClick={() => {document.getElementById('scroll').scrollIntoView()}} className='flex-ai-c btn'><span></span> بزن بریم </button>
                </div>
            </div>


            {recommendedQuizzes}

            <div className="space-med">
                <tag id='scroll' />

                <div className="quizContainer__header flex flex-ai-c wrapper-med">
                    <a className="btn" href="sort?q=newest">... نمایش بیشتر </a>
                    <h3 className='paintBrush'>جدیدترین کوییز ها</h3>
                </div>

                {SkeletonLoading(contentLoaded)}

                <ul className="quizContainer flex flex-ai-fe wrapper-med">
                    <QuizContainerWithoutViews quizzes={newestQuizzes} bgStyle='trans' />
                </ul>

            </div>

            <div className="space-med">

                <div className="quizContainer__header flex flex-ai-c wrapper-med">
                    <a className="btn" href="sort?q=monthlyBestest">... نمایش بیشتر </a>
                    <h3 className='paintBrush'>بهترین کوییز های این ماه</h3>
                </div>

                {SkeletonLoading(contentLoaded)}

                <ul className="quizContainer flex flex-ai-fe wrapper-med">
                    <QuizContainerWithoutViews quizzes={monthlyBestQuizzes} bgStyle='trans' />
                </ul>

            </div>

            <div className="space-med">

                <div className="quizContainer__header flex flex-ai-c wrapper-med">
                    <a className="btn" href="sort?q=newest_test">... نمایش بیشتر </a>
                    <h3 className='paintBrush'>جدیدترین تست ها</h3>
                </div>

                {SkeletonLoading(contentLoaded)}

                <ul className="quizContainer flex flex-ai-fe wrapper-med">
                    <QuizPointyContainer quizzes={newestPointy} bgStyle='trans' />
                </ul>

            </div>

            <div className="space-med">

                <div className="quizContainer__header flex flex-ai-c wrapper-med">
                    <a className="btn" href="sort?q=monthlyBestest_test">... نمایش بیشتر </a>
                    <h3 className='paintBrush'>بهترین تست های این ماه</h3>
                </div>

                {SkeletonLoading(contentLoaded)}

                <ul className="quizContainer flex flex-ai-fe wrapper-med">
                    <QuizPointyContainer quizzes={monthlyBestestPointy} bgStyle='trans' />
                </ul>

            </div>

            <div className="space-med">

                <div className="quizContainer__header flex flex-ai-c wrapper-med">
                    <a className="btn" href="sort?q=newest&c=celebrity">... نمایش بیشتر </a>
                    <h3 className='paintBrush'>کوییز سلبریتی</h3>
                </div>

                {SkeletonLoading(contentLoaded)}

                <ul className="quizContainer flex flex-ai-fe wrapper-med">
                    <QuizContainerWithoutViews quizzes={newestCelebrityQuizzes} bgStyle='trans' />
                </ul>

            </div>

            <div className="space-med">

                <div className="quizContainer__header flex flex-ai-c wrapper-med">
                    <a className="btn" href="sort?q=newest&c=movie-series">... نمایش بیشتر </a>
                    <h3 className='paintBrush'>کوییز فیلم و سریال</h3>
                </div>

                {SkeletonLoading(contentLoaded)}

                <ul className="quizContainer flex flex-ai-fe wrapper-med">
                    <QuizContainerWithoutViews quizzes={newestMovieSeriesQuizzes} bgStyle='trans' />
                </ul>

            </div>

            <div className="space-med">

                <div className="quizContainer__header flex flex-ai-c wrapper-med">
                    <a className="btn" href="sort?q=newest&c=psychology">... نمایش بیشتر </a>
                    <h3 className='paintBrush'>تست روانشناسی</h3>
                </div>

                {SkeletonLoading(contentLoaded)}

                <ul className="quizContainer flex flex-ai-fe wrapper-med">
                    <QuizPointyContainer quizzes={newestPsychologyPointyQuizzes} bgStyle='trans' />
                </ul>

            </div>

            {/* <adverts className="adverts adverts__bottomIndex">
                this is special adverts for landPage
            </adverts> */}

        </React.Fragment>
    );
}
 
export default Index;