import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import rateLimit from 'axios-rate-limit';
// import {InlineReactionButtons, InlineShareButtons} from 'sharethis-reactjs';
import Head from 'next/head'
import Image from 'next/image'


import { log, replaceFunction } from '../components/base'
import BackBtn from '../components/backBtn'
// import LoadingScreen from '../components/loadingScreen'
import QuizPointyContainer from '../components/quizPointyContainer'
import SkeletonLoading from '../components/skeleton'
import Layout from '../components/layout'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const Result = () => {
    const [resultSubtitle, setResultSubtitle] = useState()
    const [resultImg, setResultImg] = useState()
    const [resultText, setResultText] = useState()
    const [loadState, setLoadState] = useState()
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    const [testResult, setTestResult] = useState(null)
    const [testDetail, setTestDetail] = useState(null)

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 8, perMilliseconds: 1000, maxRPS: 150 })

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('resultQuiz')) === null) {
            window.location.href = "/404";
        } else {
            setLoadState(true)
            setTestResult(JSON.parse(localStorage.getItem('testResult')))
            setTestDetail(JSON.parse(localStorage.getItem('resultQuiz')))
        }
    }, [])

    useEffect(() => {
        detailOfResult()
        getSuggestionsQuiz()
    }, [testResult])

    // const setBackground = (backgroundUrl) => {
    //     if (backgroundUrl !== undefined) {
    //         document.getElementById('html').style = `
    //             background: url('${backgroundUrl}') center/cover fixed no-repeat !important;
    //         `
    //     }
    // }

    const detailOfResult = () => {
        if (testDetail !== null) {
            if (testResult > testDetail.result_upTo_2nd) {
                setResultImg(testDetail.result_img_1st)
                setResultSubtitle(testDetail.result_title_1st)
                setResultText(testDetail.result_text_1st)
            }
            else if (testResult >= testDetail.result_upTo_3rd) {
                setResultImg(testDetail.result_img_2nd)
                setResultSubtitle(testDetail.result_title_2nd)
                setResultText(testDetail.result_text_2nd)
            }
            else if (testResult > testDetail.result_upTo_4th) {
                setResultImg(testDetail.result_img_3rd)
                setResultSubtitle(testDetail.result_title_3rd)
                setResultText(testDetail.result_text_3rd)
            }
            else if (testResult > testDetail.result_upTo_5th) {
                setResultImg(testDetail.result_img_4th)
                setResultSubtitle(testDetail.result_title_4th)
                setResultText(testDetail.result_text_4th)
            }
            else if (testResult > testDetail.result_upTo_6th) {
                setResultImg(testDetail.result_img_5th)
                setResultSubtitle(testDetail.result_title_5th)
                setResultText(testDetail.result_text_5th)
            }
            else if (testResult > testDetail.result_upTo_7th) {
                setResultImg(testDetail.result_img_6th)
                setResultSubtitle(testDetail.result_title_6th)
                setResultText(testDetail.result_text_6th)
            }
            else if (testResult > testDetail.result_upTo_8th) {
                setResultImg(testDetail.result_img_7th)
                setResultSubtitle(testDetail.result_title_7th)
                setResultText(testDetail.result_text_7th)
            }
            else if (testResult > testDetail.result_upTo_9th) {
                setResultImg(testDetail.result_img_8th)
                setResultSubtitle(testDetail.result_title_8th)
                setResultText(testDetail.result_text_8th)
            }
            else if (testResult > testDetail.result_upTo_10th) {
                setResultImg(testDetail.result_img_9th)
                setResultSubtitle(testDetail.result_title_9th)
                setResultText(testDetail.result_text_9th)
            }
            else if (testResult <= testDetail.result_upTo_10th) {
                setResultImg(testDetail.result_img_10t)
                setResultSubtitle(testDetail.result_title_10th)
                setResultText(testDetail.result_text_10th)
            }
        }
    }

    const getSuggestionsQuiz = () => {
        testResult &&
            axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?subCategory__icontains=${replaceFunction(testDetail.subCategory, ' ', '+')}&limit=4`)
                .then((res) => { setSuggestionQuizzes(res.data.results) })
        setContentLoaded(true)
    }

    return (
        <>
            <Layout>


                {/* <LoadingScreen loadState={loadState} /> */}

                <Head>
                    <title>نتیجه تست | کوییزلند </title>
                    <meta name="description" content="نتیجه تست انجام شده" />
                    <meta name="keywords" content="کوییز, تست, کوییزلند" />
                </Head>

                <div className="result__container">
                    <div className="flex justify-center result__title">
                        <h5 className="text-lg text-right">نتیجه {testDetail?.title}</h5>
                    </div>
                    <div className="flex justify-center beforeAfterDecor flex-ai-c">
                        <h1 className="text-center result__subtitle">{resultSubtitle}</h1>
                    </div>

                    <div className='flex resultPointy__img'>
                        {
                            resultImg &&
                            <Image
                                src={resultImg}
                                width='730'
                                height='410'
                                alt={testDetail?.subCategory}
                                blurDataURL={resultImg}
                                placeholder='blur'
                            />
                        }
                    </div>

                    {
                        resultText &&
                        <div className="resultPointy wrapper-p darkGls"
                            dangerouslySetInnerHTML={{
                                __html: resultText
                            }}>
                        </div>
                    }

                    <div className='container px-20 mx-auto'>
                        <div className="text-center result__share space-sm">
                            <h5 className='text-lg'>{'ببین نتیجه ی تست دوستات چی در میاد  \n ببین شبیه هستید یا فرق دارید'}</h5>

                            {/* <InlineShareButtons
                                config={{
                                    alignment: 'center',  // alignment of buttons (left, center, right)
                                    color: 'social',      // set the color of buttons (social, white)
                                    enabled: true,        // show/hide buttons (true, false)
                                    font_size: 16,        // font size for the buttons
                                    labels: 'null',        // button labels (cta, counts, null)
                                    language: 'en',       // which language to use (see LANGUAGES)
                                    networks: [           // which networks to include (see SHARING NETWORKS)
                                        'whatsapp',
                                        'telegram',
                                        'twitter',
                                        'sharethis',
                                    ],
                                    padding: 10,          // padding within buttons (INTEGER)
                                    radius: 10,            // the corner radius on each button (INTEGER)
                                    show_total: false,
                                    size: 45,             // the size of each button (INTEGER)

                                    // OPTIONAL PARAMETERS
                                    url: `https://www.quizzland.net/test/${replaceFunction(testDetail?.title, ' ', '-')}`,
                                    image: testDetail.thumbnail,  // (defaults to og:image or twitter:image)
                                    title: testDetail?.title,            // (defaults to og:title or twitter:title)
                                }}
                            /> */}

                        </div>

                        <h2 className='flex justify-center text-lg flex-ai-c space-med'>این تست چطور بود؟</h2>

                        <div>
                            {/* <InlineReactionButtons
                                config={{
                                    alignment: 'center',  // alignment of buttons (left, center, right)
                                    enabled: true,        // show/hide buttons (true, false)
                                    language: 'en',       // which language to use (see LANGUAGES)
                                    min_count: 0,         // hide react counts less than min_count (INTEGER)
                                    padding: 12,          // padding within buttons (INTEGER)
                                    reactions: [          // which reactions to include (see REACTIONS)
                                        'slight_smile',
                                        'heart_eyes',
                                        'laughing',
                                        'astonished',
                                        'sob',
                                        'rage'
                                    ],
                                    size: 45,             // the size of each button (INTEGER)
                                    spacing: 8,           // the spacing between buttons (INTEGER)

                                // OPTIONAL PARAMETERS
                                url: `https://www.quizzland.net/test/${replaceFunction(testDetail?.title, ' ', '-')}`,
                                image: testDetail.thumbnail,  // (defaults to og:image or twitter:image)
                                title: testDetail?.title,            // (defaults to og:title or twitter:title)
                                }}
                            /> */}
                        </div>

                    </div>

                </div>

                <h2 className='text-center space-med beforeAfterDecor'>تست های مشابه</h2>

                {SkeletonLoading(contentLoaded)}

                <ul className="container flex flex-wrap m-4 align-baseline quizContainer flex-ai-fe md:px-20 justify-right">
                    {
                        suggestionQuizzes && <QuizPointyContainer quizzes={suggestionQuizzes} bgStyle='trans' />
                    }
                </ul>

                <BackBtn />

            </Layout>
        </>
    );
}

export default Result;