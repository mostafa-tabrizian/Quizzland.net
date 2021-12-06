import { useState, useEffect } from 'react'
import axios from 'axios'
import rateLimit from 'axios-rate-limit'
import Head from 'next/head'
import Layout from '../components/layout'
import Image from 'next/image'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer';

import { log, isItMobile, isItDesktop, isItIPad } from '../components/base'
import QuizContainerWithoutViews from '../components/quizContainer'
import QuizPointyContainer from '../components/quizPointyContainer'
// import LoadingScreen from './loadingScreen'

const axiosLimited = rateLimit(axios.create(), { maxRequests: 10, perMilliseconds: 1000, maxRPS: 150 })

const landPagePath = '../images/landPage-path.png'
const landPagePath_mobile = '../images/landPage-path-mobile.png'
const Q = '/../public/images/Q.png'
const QBubbles = '../images/QBubbles.png'

export const getStaticProps = async () => {
    const new_quiz = await axiosLimited.get('http://localhost:8000/dbAPI/new_quiz/?limit=12')
    const new_pointy = await axiosLimited.get('http://localhost:8000/dbAPI/new_pointy_quiz/?limit=12')
    const monthlyBest_quiz = await axiosLimited.get('http://localhost:8000/dbAPI/monthlyBest_quiz/?limit=12')
    const monthlyBest_pointy = await axiosLimited.get('http://localhost:8000/dbAPI/monthlyBest_pointy_quiz/?limit=12')
    const new_quiz_celebrity = await axiosLimited.get('http://localhost:8000/dbAPI/new_quiz/?category__icontains=celebrity&limit=12')
    const new_quiz_movieSeries = await axiosLimited.get('http://localhost:8000/dbAPI/new_quiz/?category__icontains=movie-series&limit=12')
    const new_pointy_psychology = await axiosLimited.get('http://localhost:8000/dbAPI/new_pointy_quiz/?category__icontains=psychology&limit=12')
    const loadInfinitePart1 =  await axiosLimited.get('http://localhost:8000/dbAPI/new_quiz/?limit=12&offset=12')
    const loadInfinitePart2 =  await axiosLimited.get('http://localhost:8000/dbAPI/new_quiz/?limit=12&offset=24')
    const loadInfinitePart3 =  await axiosLimited.get('http://localhost:8000/dbAPI/new_quiz/?limit=12&offset=36')

    return {
        props: {
            new_quiz: new_quiz.data.results,
            new_pointy: new_pointy.data.results,
            monthlyBest_quiz: monthlyBest_quiz.data.results,
            monthlyBest_pointy: monthlyBest_pointy.data.results,
            new_quiz_celebrity: new_quiz_celebrity.data.results,
            new_quiz_movieSeries: new_quiz_movieSeries.data.results,
            new_pointy_psychology: new_pointy_psychology.data.results,
            
            loadInfinitePart1: loadInfinitePart1.data.results,
            loadInfinitePart2: loadInfinitePart2.data.results,
            loadInfinitePart3: loadInfinitePart3.data.results,
        },
        revalidate: 24 * 60 * 60,  // 1 day
    }
}

const Index = ({ new_quiz, new_pointy, monthlyBest_quiz,
                 monthlyBest_pointy, new_quiz_celebrity, new_quiz_movieSeries,
                 new_pointy_psychology, loadInfinitePart1, loadInfinitePart2,
                 loadInfinitePart3}) => {
    const [recommendedQuizzes, setRecommendedQuizzes] = useState([])

    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    
    const [new_quiz_ref, new_quiz_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [new_pointy_ref, new_pointy_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [monthlyBest_quiz_ref, monthlyBest_quiz_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [monthlyBest_pointy_ref, monthlyBest_pointy_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [new_quiz_celebrity_ref, new_quiz_celebrity_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [new_quiz_movieSeries_ref, new_quiz_movieSeries_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [new_pointy_psychology_ref, new_pointy_psychology_inView] = useInView({threshold: 0, triggerOnce: true,});
    
    const [loadInfinitePart1_ref, loadInfinitePart1_inView] = useInView({threshold: 0, triggerOnce: true,})
    const [loadInfinitePart2_ref, loadInfinitePart2_inView] = useInView({threshold: 0, triggerOnce: true,})   
    const [loadInfinitePart3_ref, loadInfinitePart3_inView] = useInView({threshold: 0, triggerOnce: true,})

    useEffect(() => {
        landPagePathSelector()
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
    
            const search_top_1st_category = await axiosLimited.get(`http://localhost:8000/dbAPI/new_quiz/?subCategory__icontains=${top1stUserCategory}&limit=4`)
            Array.prototype.push.apply(matchedQuizzes, search_top_1st_category.data.results)
            
            const search_top_2nd_category = await axiosLimited.get(`http://localhost:8000/dbAPI/new_quiz/?subCategory__icontains=${top2ndUserCategory}&limit=2`)
            Array.prototype.push.apply(matchedQuizzes, search_top_2nd_category.data.results)
            
            const search_top_3rd_category = await axiosLimited.get(`http://localhost:8000/dbAPI/new_quiz/?subCategory__icontains=${top3rdUserCategory}&limit=2`)
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
                                {/* <QuizContainerWithoutViews quizzes={matchedQuizzes} bgStyle='trans' /> */}
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

    const landPagePathSelector = () => {
        if (typeof window !== 'undefined') {
            if (isItDesktop()) {
                return {
                    background: `url('${landPagePath}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'bottom center',
                    backgroundSize: 'cover'
                }
            }
            else {  // mobile or tablet path
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
        <>
            <Layout>

                {/* <LoadingScreen loadState={loadState} /> */}

                <Head>
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

                </Head>

                <div className={`hero flex flex-jc-c flex-ai-c`}>
                    <div className="hero__path pos-abs" style={landPagePathSelector()}></div>
                    {
                        !(isItMobile()) &&
                        <div className='hero__logo tx-al-c pos-rel'>
                            <Image
                                src={Q}
                                width='400'
                                height='553'
                                alt='لوگوی کوییزلند'
                                priority
                                className='Q'          
                            />
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
                        <Link href="sort?q=newest"><a className="btn">... نمایش بیشتر </a></Link>
                        <h3 className='paintBrush'>جدیدترین کوییز ها</h3>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe wrapper-med" ref={new_quiz_ref}>
                        {
                            new_quiz_inView &&
                            <QuizContainerWithoutViews quizzes={new_quiz} bgStyle={'trans'} />
                        }
                    </ul>

                </div>

                {/* Adverts */}
                {
                    !(isItMobile()) &&
                    <div className='adverts_center' id='mediaad-WSYR'></div>
                }

                {
                    isItMobile() &&
                    <div className='adverts_center' id='mediaad-KlKX'></div>
                }

                <div className="space-med">

                    <div className="quizContainer__header flex flex-ai-c wrapper-med">
                        <Link href="sort?q=monthlyBestest"><a className="btn">... نمایش بیشتر </a></Link>
                        <h3 className='paintBrush'>بهترین کوییز های این ماه</h3>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe wrapper-med" ref={monthlyBest_quiz_ref}>
                        {
                            monthlyBest_quiz_inView &&
                            <QuizContainerWithoutViews quizzes={monthlyBest_quiz} bgStyle={'trans'} />
                        }
                    </ul>

                </div>

                <div className="space-med">

                    <div className="quizContainer__header flex flex-ai-c wrapper-med">
                        <Link href="sort?q=newest_test"><a className="btn">... نمایش بیشتر </a></Link>
                        <h3 className='paintBrush'>جدیدترین تست ها</h3>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe wrapper-med" ref={new_pointy_ref}>
                        {
                            new_pointy_inView &&
                            <QuizPointyContainer quizzes={new_pointy} bgStyle='trans' />
                        }
                    </ul>

                </div>

                {/* Adverts */}
                {
                    !(isItMobile()) &&
                    <div className='adverts_center' id='mediaad-kvDM'></div>
                }

                {
                    isItMobile() &&
                    <div className='adverts_center' id='mediaad-OheS'></div>
                }

                <div className="space-med">

                    <div className="quizContainer__header flex flex-ai-c wrapper-med">
                        <Link href="sort?q=monthlyBestest_test"><a className="btn">... نمایش بیشتر </a></Link>
                        <h3 className='paintBrush'>بهترین تست های این ماه</h3>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe wrapper-med" ref={monthlyBest_pointy_ref}>
                        {
                            monthlyBest_pointy_inView &&
                            <QuizPointyContainer quizzes={monthlyBest_pointy} bgStyle='trans' />
                        }
                    </ul>

                </div>

                <div className="space-med">

                    <div className="quizContainer__header flex flex-ai-c wrapper-med">
                        <Link href="sort?q=newest&c=celebrity"><a className="btn">... نمایش بیشتر </a></Link>
                        <h3 className='paintBrush'>کوییز سلبریتی</h3>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe wrapper-med" ref={new_quiz_celebrity_ref}>
                        {
                            new_quiz_celebrity_inView &&
                            <QuizContainerWithoutViews quizzes={new_quiz_celebrity} bgStyle='trans' />
                        }
                    </ul>

                </div>

                {/* Adverts */}
                {
                    !(isItMobile()) &&
                    <div className='adverts_center' id='mediaad-niPM'></div>
                }

                {
                    isItMobile() &&
                    <div className='adverts_center' id='mediaad-QCZY'></div>
                }

                <div className="space-med">

                    <div className="quizContainer__header flex flex-ai-c wrapper-med">
                        <Link href="sort?q=newest&c=movie-series"><a className="btn">... نمایش بیشتر </a></Link>
                        <h3 className='paintBrush'>کوییز فیلم و سریال</h3>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe wrapper-med" ref={new_quiz_movieSeries_ref}>
                        {
                            new_quiz_movieSeries_inView &&
                            <QuizContainerWithoutViews quizzes={new_quiz_movieSeries} bgStyle='trans' />
                        }
                    </ul>

                </div>

                <div className="space-med">

                    <div className="quizContainer__header flex flex-ai-c wrapper-med">
                        <Link href="sort?q=newest&c=psychology"><a className="btn">... نمایش بیشتر </a></Link>
                        <h3 className='paintBrush'>تست روانشناسی</h3>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe wrapper-med" ref={new_pointy_psychology_ref}>
                        {
                            new_pointy_psychology_inView &&
                            <QuizPointyContainer quizzes={new_pointy_psychology} bgStyle='trans' />
                        }
                    </ul>

                </div>

                {/* Adverts */}
                {
                    !(isItMobile()) &&
                    <div className='adverts_center' id='mediaad-bXEw'></div>
                }

                {
                    isItMobile() &&
                    <div className='adverts_center' id='mediaad-qBZW'></div>
                }

                <div className="space-med">
                    <div className="quizContainer__header flex flex-ai-c wrapper-med">
                        <Link href="sort?q=newest"><a className="btn">... نمایش بیشتر تر </a></Link>
                        <h3 className='paintBrush'>کوییز های بیشتر</h3>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe wrapper-med" ref={loadInfinitePart1_ref}>
                        {
                            loadInfinitePart1_inView &&
                            <QuizContainerWithoutViews quizzes={loadInfinitePart1} bgStyle='trans' />
                        }
                    </ul>
                    
                    <ul className="quizContainer flex flex-ai-fe wrapper-med" ref={loadInfinitePart2_ref}>
                        {
                            loadInfinitePart2_inView &&
                            <QuizContainerWithoutViews quizzes={loadInfinitePart2} bgStyle='trans' />
                        }
                    </ul>

                    <ul className="quizContainer flex flex-ai-fe wrapper-med" ref={loadInfinitePart3_ref}>
                        {
                            loadInfinitePart3_inView &&
                            <QuizContainerWithoutViews quizzes={loadInfinitePart3} bgStyle='trans' />
                        }
                    </ul>
                </div>

            </Layout>
        </>
    );
}
 
export default Index;