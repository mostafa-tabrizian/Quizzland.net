import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import { log } from './base'
import QuizContainerWithoutViews from './quizContainerWithoutViews'
import QuizIndex from './quizIndex'
import SortIndex from './sortIndex'
import Header from './header'
import LoadingScreen from './loadingScreen'

const landPagePath = '/static/img/landPage-path.png'
const landPagePath_light = '/static/img/landPage-path-light.png'
const Q = '/static/img/Q.png'
const QBubbles = '/static/img/QBubbles.png'
const category_celebrity = '/static/img/category-celebrity.jpg'
const category_movieSeries = '/static/img/category-movieSeries.jpg'

const Index = () => {
    const [newestCelebrityQuizzes, setNewestCelebrityQuizzes] = useState([])
    const [newestMovieSeriesQuizzes, setNewestMovieSeriesQuizzes] = useState([])

    const [monthlyBestQuizzes, setMonthlyBestQuizzes] = useState([])
    const [bestQuizzes, setBestQuizzes] = useState([])

    const [monthlyCelebrityBestQuizzes, setMonthlyCelebrityBestQuizzes] = useState([])
    const [bestCelebrityQuizzes, setBestCelebrityQuizzes] = useState([])
    const [monthlyMovieSeriesBestQuizzes, setMonthlyMovieSeriesBestQuizzes] = useState([])
    const [bestMovieSeriesQuizzes, setBestMovieSeriesQuizzes] = useState([])

    const [loadState, setLoadState] = useState()
    
    useEffect(() => {
        landPagePathSelector()
        grabData()
        setLoadState(true)
        if (document.getElementById('html')) {
            document.getElementById('html').style='background: None'
        }
    }, [])

    const grabData = async () => {
        const new_quiz_celebrity = await axios.get('/dbQuizzland$M19931506/new_quiz/?category__icontains=celebrity&limit=8')
        setNewestCelebrityQuizzes(new_quiz_celebrity.data.results)

        const new_quiz_movieSeries = await axios.get('/dbQuizzland$M19931506/new_quiz/?category__icontains=movie-series&limit=8')
        setNewestMovieSeriesQuizzes(new_quiz_movieSeries.data.results)

        // ---------

        const monthlyBest_quiz = await axios.get('/dbQuizzland$M19931506/monthlyBest_quiz/?limit=5')
        setMonthlyBestQuizzes(monthlyBest_quiz.data.results)

        const monthlyBest_quiz_celebrity = await axios.get('/dbQuizzland$M19931506/monthlyBest_quiz/?category__icontains=celebrity&limit=13')
        setMonthlyCelebrityBestQuizzes(monthlyBest_quiz_celebrity.data.results)

        const monthlyBest_quiz_movieSeries = await axios.get('/dbQuizzland$M19931506/monthlyBest_quiz/?category__icontains=movie-series&limit=13')
        setMonthlyMovieSeriesBestQuizzes(monthlyBest_quiz_movieSeries.data.results)

        // ---------
        
        const best_quiz = await axios.get('/dbQuizzland$M19931506/best_quiz/?limit=5')
        setBestQuizzes(best_quiz.data.results)

        const best_quiz_celebrity = await axios.get('/dbQuizzland$M19931506/best_quiz/?category__icontains=celebrity&limit=13')
        setBestCelebrityQuizzes(best_quiz_celebrity.data.results)


        const best_quiz_movieSeries = await axios.get('/dbQuizzland$M19931506/best_quiz/?category__icontains=movie-series&limit=13')
        setBestMovieSeriesQuizzes(best_quiz_movieSeries.data.results)
        
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

            <Header
                title='کوئیزلند | Quizzland'
                description='سایت کوئیزلند وب‌ سایت کوئيز و تست برای کتگوری های متنوع همچون کوئیز سلبریتی ها, کوئيز های فیلم و سریال, کوئیز های گیمینگ و تست های روانشناسی معتبر از سایت های رسمی و باحال ترین کوئيز ها'
                keywords='کوییز, سایت بازی کوییز, بازی کوئيز, بازی کوییز, کوئيزلند, کوییزلند, کوئیز, کوئیز های فیلم و سریال, کوئیز های سلبریتی و آدم های معروف, خواننده, بازیگر, کوئیز های گیمینگ, تست های روانشناسی معتبر, کوئیز های باحال, کوئيز های فان, بهترین وب سایت کوئيز, بهترین وب سایت تست'
            />

            <div className="hero flex flex-jc-c flex-ai-c">
                <div className="hero__path pos-abs" style={landPagePathSelector()}></div>
                <div className='hero__logo tx-al-c hideForMobile'>
                    <img src={Q} className='Q' alt="لوگوی کوئيزلند" />
                    <img src={QBubbles} className='Q__Bubbles' alt="لوگوی کوئيزلند" />
                </div>
                <div className='hero__start tx-al-r'>
                    <h1>اینجا کوئيزلندِ</h1>
                    <h2>😎 جایی که میتونی خودت رو به عنوان فن واقعی به بقیه ثابت کنی پس اگر آماده ای</h2>
                    <button onClick={() => {document.getElementById('category').scrollIntoView()}} className='flex-ai-c btn'><span></span> بزن بریم </button>
                </div>
            </div>

            <h2 className="category__title tx-al-r wrapper-med">کتگوری</h2>

            <div className="category flex flex-ai-c flex-jc-fe wrapper-med" id="category">
                <Link to="/category/movie-series?q=newest">
                        <img src={category_movieSeries} alt="کوئیز کتگوری دسته ی فیلم و سریال مربوط به سوالات در مورد کارکتر شخصیت فیلم ها یا داستان آن" />
                        <span className='tx-al-c'>🎬 فیلم و سریال </span>
                </Link>
                <Link to="/category/celebrity?q=newest">
                    <img src={category_celebrity} alt="کوئیز های کتگوری دسته ی سلبریتی مربوط به افراد مشهور مانند بازیگر و خواننده که مربوط به سوالات در مورد اطلاعات شخصی آنها یا فعالیت آنهاست" />
                    <span className='tx-al-c'>✨ سلبریتی </span>
                </Link>
            </div>

            <div className="space-med">
                <div className="quizContainer__header flex flex-ai-c wrapper-med">
                    <Link className="btn" to="sort?q=newest&c=celebrity">...نمایش بیشتر</Link>
                    <h2>سلبریتی</h2>
                </div>
                <ul className="quizContainer flex flex-jc-fs flex-ai-fe wrapper-med">
                    <QuizContainerWithoutViews quizzes={newestCelebrityQuizzes} bgStyle='trans' />
                </ul>
            </div>

            <div className="space-med">
                <div className="quizContainer__header flex flex-ai-c wrapper-med">
                    <Link className="btn" to="sort?q=newest&c=movie-series">...نمایش بیشتر</Link>
                    <h2>فیلم و سریال</h2>
                </div>
                <ul className="quizContainer flex flex-jc-fs flex-ai-fe wrapper-med">
                    <QuizContainerWithoutViews quizzes={newestMovieSeriesQuizzes} bgStyle='trans' />
                </ul>
            </div>

            <SortIndex />

            <div className="sort pos-rel flex flex-jc-c space-l">
                
                <div className="sort__all fadeIn">
                    <div className="sort__container flex flex-jc-c">
                        <div className="sort-monthlyViews">
                            <h2 className="tx-al-c">پر بازدید ترین های این ماه</h2>
                            <ul className="sort__style">
                                <QuizIndex quizzes={monthlyBestQuizzes} />
                            </ul>
                            <Link className="sort__more pos-abs" to="sort?q=monthlyBestest"></Link>
                        </div>
                        <div className="sort-views">
                            <h2 className="tx-al-c">پر بازدید ترین کوئیز ها</h2>
                            <ul className="sort__style">
                                <QuizIndex quizzes={bestQuizzes} />
                            </ul>
                            <Link className="sort__more pos-abs" to="sort?q=bestest"></Link>
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
                            <Link className="sort__more pos-abs" to="sort?q=monthlyBestest&c=celebrity"></Link>
                        </div>
                        <div className="sort-views">
                            <h2 className="tx-al-c">پر بازدید ترین ها</h2>
                            <ul className="sort__style">
                                <QuizIndex quizzes={bestCelebrityQuizzes} />
                            </ul>
                            <Link className="sort__more pos-abs" to="sort?q=bestest&c=celebrity"></Link>
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
                            <Link className="sort__more pos-abs" to="sort?q=monthlyBestest&c=movie-series"></Link>
                        </div>
                        <div className="sort-views">
                            <h2 className="tx-al-c">پر بازدید ترین ها</h2>
                            <ul className="sort__style">
                                <QuizIndex quizzes={bestMovieSeriesQuizzes} />
                            </ul>
                            <Link className="sort__more pos-abs" to="sort?q=bestest&c=movie-series"></Link>
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