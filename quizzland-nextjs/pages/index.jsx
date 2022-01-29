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
const API_URL = process.env.NEXT_PUBLIC_API_URL

export const getServerSideProps = async () => {
    const quiz_new = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?limit=8`)
    const new_pointy = await axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?limit=8`)
    const quiz_monthlyBest = await axiosLimited.get(`${API_URL}/dbAPI/quiz_monthlyBest/?limit=8`)
    const monthlyBest_pointy = await axiosLimited.get(`${API_URL}/dbAPI/pointy_monthlyBest/?limit=8`)
    const quiz_new_celebrity = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?category__icontains=celebrity&limit=8`)
    const quiz_new_movieSeries = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?category__icontains=movie-series&limit=8`)
    const new_pointy_psychology = await axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?category__icontains=psychology&limit=8`)
    const loadInfinitePart1 =  await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?limit=8&offset=8`)
    const loadInfinitePart2 =  await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?limit=8&offset=24`)
    const loadInfinitePart3 =  await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?limit=8&offset=36`)

    return {
        props: {
            quiz_new: quiz_new.data.results,
            new_pointy: new_pointy.data.results,
            quiz_monthlyBest: quiz_monthlyBest.data.results,
            monthlyBest_pointy: monthlyBest_pointy.data.results,
            quiz_new_celebrity: quiz_new_celebrity.data.results,
            quiz_new_movieSeries: quiz_new_movieSeries.data.results,
            new_pointy_psychology: new_pointy_psychology.data.results,
            
            loadInfinitePart1: loadInfinitePart1.data.results,
            loadInfinitePart2: loadInfinitePart2.data.results,
            loadInfinitePart3: loadInfinitePart3.data.results,
            revalidate: 24 * 60 * 60,  // 1 day
        },
    }
}

const Index = ({ quiz_new, new_pointy, quiz_monthlyBest,
                 monthlyBest_pointy, quiz_new_celebrity, quiz_new_movieSeries,
                 new_pointy_psychology, loadInfinitePart1, loadInfinitePart2,
                 loadInfinitePart3}) => {
    const [recommendedQuizzes, setRecommendedQuizzes] = useState([])

    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    
    const [quiz_new_ref, quiz_new_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [new_pointy_ref, new_pointy_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [quiz_monthlyBest_ref, quiz_monthlyBest_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [monthlyBest_pointy_ref, monthlyBest_pointy_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [quiz_new_celebrity_ref, quiz_new_celebrity_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [quiz_new_movieSeries_ref, quiz_new_movieSeries_inView] = useInView({threshold: 0, triggerOnce: true,});
    const [new_pointy_psychology_ref, new_pointy_psychology_inView] = useInView({threshold: 0, triggerOnce: true,});
    
    const [loadInfinitePart1_ref, loadInfinitePart1_inView] = useInView({threshold: 0, triggerOnce: true,})
    const [loadInfinitePart2_ref, loadInfinitePart2_inView] = useInView({threshold: 0, triggerOnce: true,})   
    const [loadInfinitePart3_ref, loadInfinitePart3_inView] = useInView({threshold: 0, triggerOnce: true,})

    useEffect(() => {
        // landPagePathSelector()
        recommendationQuiz()
        setLoadState(true)
        if (document.querySelector('html')) {
            document.querySelector('html').style='background: None'
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
    
            const search_top_1st_category = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?subCategory__icontains=${top1stUserCategory}&limit=4`)
            Array.prototype.push.apply(matchedQuizzes, search_top_1st_category.data.results)
            
            const search_top_2nd_category = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?subCategory__icontains=${top2ndUserCategory}&limit=2`)
            Array.prototype.push.apply(matchedQuizzes, search_top_2nd_category.data.results)
            
            const search_top_3rd_category = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?subCategory__icontains=${top3rdUserCategory}&limit=2`)
            Array.prototype.push.apply(matchedQuizzes, search_top_3rd_category.data.results)
    
            const recommendedQuizzesList = () => {
                return (
                    matchedQuizzes.length >= 4 &&
                    <div className="mb-8">
    
                        <div className="quizContainer__header grid grid-cols-2 md:m-auto mr-4 mb-8 md:w-4/5 flex-ai-c md:container md:px-20">
                            <h3 className=''>پیشنهادی های کوییزلند به شما</h3>
                        </div>
                        
                        <div>
                            <ul className="quizContainer flex flex-ai-fe m-4 container md:px-20 flex-wrap align-baseline justify-right">
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

    // const landPagePathSelector = () => {
    //     try {
    //         if (typeof window !== 'undefined') {
        
    //             if (isItDesktop()) {
    //                 return {
    //                     backgroundImage: `url('/images/landPage-path.png')`,
    //                     backgroundRepeat: 'no-repeat',
    //                     backgroundPosition: 'bottom center',
    //                     backgroundSize: 'cover'
    //                 }
    //             }
    //             else {  // mobile or tablet path
    //                 return {
    //                     backgroundImage: `url('/images/landPage-path-mobile.png')`,
    //                     backgroundRepeat: 'no-repeat',
    //                     backgroundPosition: 'bottom center',
    //                     backgroundSize: 'cover'
    //                 }
    //             }
    //         }
    //     } catch {return ''}
    // }

    return (
        <>
            <Layout>

                {/* <LoadingScreen loadState={loadState} /> */}

                <Head>
                    <title>کوییزلند | بهترین و جدیدترین کوییز، تست و تریویا ها</title>
                    <meta name="description" content="سایت کوییزلند وب سایت کوییز و تست برای کتگوری های متنوع همچون سلبریتی , فیلم و سریال و تست های روانشناسی معتبر از سایت های رسمی و کوییزهای باحال دیگه" />
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

                <div className={`hero flex justify-center flex-ai-c`}>
                    <div className="hero_path absolute right-0 top-[-12rem] md:top-[-16rem] h-[115%] w-[100%]"></div>

                    <div className='relative mr-5 ml-5 drop-shadow-[10px_15px_10px_black] hidden md:block'>
                        <div className='pointer-events-none'>
                            <Image
                                src='/images/Q.png'
                                width='350'
                                height='500'
                                alt='لوگوی کوییزلند'
                                priority   
                            />
                        </div>
                        <div className='hero_bubbles pointer-events-none absolute top-0 left-0'>
                            <Image
                                src='/images/QBubbles.png'
                                width='350'
                                height='500'
                                alt='لوگوی کوییزلند'
                                priority   
                            />
                        </div>
                    </div>

                    <div className='hero__start text-right mr-6 mb-[50%] lg:mb-0 lg:mr-4'>
                        <h1 className='relative text-[4.5rem] mb-2'>
                            اینجا کوییزلندِ
                        </h1>
                        <h2 className='text-[1.6rem] max-w-[33rem]
                                        mb-20 ml-3 drop-shadow-[0_0_25px_black]'>
                            جایی که میتونی خودت رو به عنوان فن واقعی به بقیه ثابت کنی پس اگر آماده ای 😎 
                        </h2>
                        <button
                            onClick={() => {document.getElementById('scroll').scrollIntoView()}}
                            className='
                                alignment-center btn text-[1.6rem] py-[.5rem] px-[3rem]
                                radius-[5rem] inline-flex shadow-[inset_6px_0_22px_black]
                                relative z-1
                        '>
                            <span></span>
                            بزن بریم
                        </button>
                    </div>
                </div>

                {recommendedQuizzes}

                <div className="mb-8">
                    <tag id='scroll' />

                    <div className="quizContainer__header grid grid-cols-2 md:m-auto mr-4 mb-8 md:w-4/5 flex-ai-c  md:container md:px-20">
                        <h3 className=''>جدیدترین کوییز ها</h3>
                        <Link href="/sort?st=newest"><a className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></a></Link>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe m-4 container md:px-20 flex-wrap align-baseline justify-right" ref={quiz_new_ref}>
                        {
                            quiz_new_inView &&
                            <QuizContainerWithoutViews quizzes={quiz_new} bgStyle={'trans'} />
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

                <div className="mb-8">

                    <div className="quizContainer__header grid grid-cols-2 md:m-auto mr-4 mb-8 md:w-4/5 flex-ai-c  md:container md:px-20">
                        <h3 className=''>بهترین کوییز های این ماه</h3>
                        <Link href="/sort?st=monthlyBestest"><a className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></a></Link>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe m-4 container md:px-20 flex-wrap align-baseline justify-right" ref={quiz_monthlyBest_ref}>
                        {
                            quiz_monthlyBest_inView &&
                            <QuizContainerWithoutViews quizzes={quiz_monthlyBest} bgStyle={'trans'} />
                        }
                    </ul>

                </div>

                <div className="mb-8">

                    <div className="quizContainer__header grid grid-cols-2 md:m-auto mr-4 mb-8 md:w-4/5 flex-ai-c  md:container md:px-20">
                        <h3 className=''>جدیدترین تست ها</h3>
                        <Link href="/sort?st=newest_test"><a className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></a></Link>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe m-4 container md:px-20 flex-wrap align-baseline justify-right" ref={new_pointy_ref}>
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

                <div className="mb-8">

                    <div className="quizContainer__header grid grid-cols-2 md:m-auto mr-4 mb-8 md:w-4/5 flex-ai-c  md:container md:px-20">
                        <h3 className=''>بهترین تست های این ماه</h3>
                        <Link href="/sort?st=monthlyBestest_test"><a className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></a></Link>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe m-4 container md:px-20 flex-wrap align-baseline justify-right" ref={monthlyBest_pointy_ref}>
                        {
                            monthlyBest_pointy_inView &&
                            <QuizPointyContainer quizzes={monthlyBest_pointy} bgStyle='trans' />
                        }
                    </ul>

                </div>

                <div className="mb-8">

                    <div className="quizContainer__header grid grid-cols-2 md:m-auto mr-4 mb-8 md:w-4/5 flex-ai-c  md:container md:px-20">
                        <h3 className=''>کوییز سلبریتی</h3>
                        <Link href="/sort?st=newest&c=celebrity"><a className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></a></Link>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe m-4 container md:px-20 flex-wrap align-baseline justify-right" ref={quiz_new_celebrity_ref}>
                        {
                            quiz_new_celebrity_inView &&
                            <QuizContainerWithoutViews quizzes={quiz_new_celebrity} bgStyle='trans' />
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

                <div className="mb-8">

                    <div className="quizContainer__header grid grid-cols-2 md:m-auto mr-4 mb-8 md:w-4/5 flex-ai-c  md:container md:px-20">
                        <h3 className=''>کوییز فیلم و سریال</h3>
                        <Link href="/sort?st=newest&c=movie-series"><a className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></a></Link>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe m-4 container md:px-20 flex-wrap align-baseline justify-right" ref={quiz_new_movieSeries_ref}>
                        {
                            quiz_new_movieSeries_inView &&
                            <QuizContainerWithoutViews quizzes={quiz_new_movieSeries} bgStyle='trans' />
                        }
                    </ul>

                </div>

                <div className="mb-8">

                    <div className="quizContainer__header grid grid-cols-2 md:m-auto mr-4 mb-8 md:w-4/5 flex-ai-c  md:container md:px-20">
                        <h3 className=''>تست روانشناسی</h3>
                        <Link href="/sort?st=newest&c=psychology"><a className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></a></Link>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe m-4 container md:px-20 flex-wrap align-baseline justify-right" ref={new_pointy_psychology_ref}>
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

                <div className="mt-8 mb-8">
                    <div className="quizContainer__header grid grid-cols-2 md:m-auto mr-4 mb-8 md:w-4/5 flex-ai-c  md:container md:px-20">
                        <h3 className=''>کوییز های بیشتر</h3>
                        <Link href="/sort?st=newest"><a className="ml-8 text-[1rem] text-left"><h4>نتایج بیشتر</h4></a></Link>
                    </div>

                    <ul className="quizContainer flex flex-ai-fe m-4 container md:px-20 flex-wrap align-baseline justify-right" ref={loadInfinitePart1_ref}>
                        {
                            loadInfinitePart1_inView &&
                            <QuizContainerWithoutViews quizzes={loadInfinitePart1} bgStyle='trans' />
                        }
                    </ul>
                    
                    <ul className="quizContainer flex flex-ai-fe m-4 container md:px-20 flex-wrap align-baseline justify-right" ref={loadInfinitePart2_ref}>
                        {
                            loadInfinitePart2_inView &&
                            <QuizContainerWithoutViews quizzes={loadInfinitePart2} bgStyle='trans' />
                        }
                    </ul>

                    <ul className="quizContainer flex flex-ai-fe m-4 container md:px-20 flex-wrap align-baseline justify-right" ref={loadInfinitePart3_ref}>
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