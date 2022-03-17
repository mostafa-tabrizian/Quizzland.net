import React, { useEffect, useState, useRef } from 'react'

import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import { Rate } from 'antd';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import axios from 'axios'
import {InlineReactionButtons, InlineShareButtons} from 'sharethis-reactjs';

import Header from './header'
import axiosInstance from './axiosApi'
import { log, replaceFunction } from './base'
import BackBtn from './backBtn'
import LoadingScreen from './loadingScreen'
import QuizPointyContainer from './quizPointyContainer'
import SkeletonLoading from './skeletonLoading'

const Result = (props) => {
    const [resultSubtitle, setResultSubtitle] = useState()
    const [resultImg, setResultImg] = useState()
    const [resultText, setResultText] = useState()
    const [loadState, setLoadState] = useState()
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    const [testResult, setTestResult] = useState()
    const [testDetail, setTestDetail] = useState()
    const [rateChangeable, setRateChangeable] = useState(true)
    const [id, setId] = useState()

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
    
    const customIcons = {
        1: <FrownOutlined />,
        2: <FrownOutlined />,
        3: <MehOutlined />,
        4: <SmileOutlined />,
        5: <SmileOutlined />,
    };

    const detailOfResult = () => {
        if (testDetail) {
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


    const tryAgainTheQuiz = () => {
        window.history.go(-1)
    }

    const getSuggestionsQuiz = async () => {
        await axios.get(`/api/pointy_new/?subCategory__icontains=${testResult && replaceFunction(testResult?.subCategory, ' ', '+')}&limit=4`)
            .then((res) => {
                setSuggestionQuizzes(res.data.results)
            })
        setContentLoaded(true)
    }

    return (
        <React.Fragment>
            
            <LoadingScreen loadState={loadState} />

            <Header linkType='Link'/>

            <Helmet>
                <title>نتیجه تست | کوییزلند </title>
                <meta name="description" content="نتیجه تست انجام شده" />
                <meta name="keywords" content="کوییز, تست, کوییزلند" />
            </Helmet>

            <div className="result__container">
                    <div className="flex justify-center result__title">
                        <h5 className="text-lg text-right">نتیجه {testDetail?.title}</h5>
                    </div>
                    <div className="flex justify-center beforeAfterDecor items-center">
                        <h1 className="text-center result__subtitle">{resultSubtitle}</h1>
                    </div>

                    <div className='flex resultPointy__img'>
                        {
                            resultImg &&
                            <img
                                src={resultImg}
                                width={690}
                                alt={testDetail?.subCategory}
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

                        <h2 className='flex justify-center text-lg items-center space-med'>این تست چطور بود؟</h2>

                        <Rate
                            character={({ index }) => customIcons[index + 1]}
                            allowClear={true}
                            disabled={rateChangeable ? false : true}
                            className='flex justify-center my-3 biggerRate'
                            onChange={async (value) => {
                                setRateChangeable(false)

                                const adminDetail = {
                                    username: process.env.ADMINUSERNAME,
                                    password: process.env.ADMINPASSWORD,
                                }

                                let authToken   

                                await axios.post('/api/token/obtain/', adminDetail)
                                    .then((req) => {
                                        authToken = req.data.access
                                    })

                                const now = new Date().getTime()

                                let lastRate
                                let RateCount

                                await axiosInstance.get(`/api/pointy_new/${testDetail?.id}/?&timestamp=${now}`)
                                    .then((req) => {
                                        lastRate = req.data.rate
                                        RateCount = req.data.rate_count
                                    })
                                    .catch((err) => {
                                        log(err)
                                    })

                                    
                                await axiosInstance.put(
                                    `/api/pointy_new/${testDetail?.id}/`,
                                    {
                                        rate: lastRate == 0 ? 5 : (lastRate + value) / 2,
                                        rate_count: RateCount + 1
                                    },
                                    { 
                                        'Authorization': "JWT " + authToken,
                                        'Content-Type': 'application/json',
                                        'accept': 'application/json'
                                     }
                                )
                            }}
                        />

                    </div>

                </div>

                <h2 className='text-center space-med beforeAfterDecor'>تست های مشابه</h2>

                {SkeletonLoading(contentLoaded)}

                <ul className="w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto flex flex-wrap align-baseline quizContainer flex-ai-fe justify-right">
                    {
                        suggestionQuizzes && <QuizPointyContainer quizzes={suggestionQuizzes} bgStyle='trans' />
                    }
                </ul>

            <BackBtn />
            
            <button onClick={tryAgainTheQuiz} className='tryAgain btn text-center' aria-label="Try Again The Quiz" type="button">انجام دادن دوباره تست</button>

        </React.Fragment>
    );
}
 
export default Result;