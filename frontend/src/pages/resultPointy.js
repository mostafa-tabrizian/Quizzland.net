import React, { useEffect, useState, useRef } from 'react'
import { Helmet } from "react-helmet";
import { Rate, message } from 'antd';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import axiosInstance from '../components/axiosApi';
import { InlineShareButtons } from 'sharethis-reactjs';

import Header from '../components/header'
import Footer from '../components/footer'
import { log, replaceFunction } from '../components/base'
import BackBtn from '../components/backBtn'
import LoadingScreen from '../components/loadingScreen'
import QuizContainer from '../components/quizContainer'
import SkeletonLoading from '../components/skeletonLoading';

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
            if (testResult <= testDetail.result_upTo_1st) {
                setResultImg(testDetail.result_img_1st)
                setResultSubtitle(testDetail.result_title_1st)
                setResultText(testDetail.result_text_1st)
            }
            else if (testResult <= testDetail.result_upTo_2nd) {
                setResultImg(testDetail.result_img_2nd)
                setResultSubtitle(testDetail.result_title_2nd)
                setResultText(testDetail.result_text_2nd)
            }
            else if (testResult <= testDetail.result_upTo_3rd) {
                setResultImg(testDetail.result_img_3rd)
                setResultSubtitle(testDetail.result_title_3rd)
                setResultText(testDetail.result_text_3rd)
            }
            else if (testResult <= testDetail.result_upTo_4th) {
                setResultImg(testDetail.result_img_4th)
                setResultSubtitle(testDetail.result_title_4th)
                setResultText(testDetail.result_text_4th)
            }
            else if (testResult <= testDetail.result_upTo_5th) {
                setResultImg(testDetail.result_img_5th)
                setResultSubtitle(testDetail.result_title_5th)
                setResultText(testDetail.result_text_5th)
            }
            else if (testResult <= testDetail.result_upTo_6th) {
                setResultImg(testDetail.result_img_6th)
                setResultSubtitle(testDetail.result_title_6th)
                setResultText(testDetail.result_text_6th)
            }
            else if (testResult <= testDetail.result_upTo_7th) {
                setResultImg(testDetail.result_img_7th)
                setResultSubtitle(testDetail.result_title_7th)
                setResultText(testDetail.result_text_7th)
            }
            else if (testResult <= testDetail.result_upTo_8th) {
                setResultImg(testDetail.result_img_8th)
                setResultSubtitle(testDetail.result_title_8th)
                setResultText(testDetail.result_text_8th)
            }
            else if (testResult <= testDetail.result_upTo_9th) {
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

    const getSuggestionsQuiz = async (category, subCategory) => {
        const quiz = await axiosInstance.get(`/api/quiz/?subCategory__icontains=${replaceFunction(subCategory, ' ', '+')}&limit=8&public=true`)
        const pointy = await axiosInstance.get(`/api/pointy/?subCategory__icontains=${replaceFunction(subCategory, ' ', '+')}&limit=8&public=true`)
        let content = quiz.data.results.concat(pointy.data.results)

        if (content.length != 8) {
            const quizByCategory = await axiosInstance.get(`/api/quiz/?category__exact=${category}&limit=8&public=true`)
            const pointyByCategory = await axiosInstance.get(`/api/pointy/?category__exact=${category}&limit=8&public=true`)
            content = content.concat(quizByCategory.data.results.concat(pointyByCategory.data.results))
        }

        setSuggestionQuizzes(content.sort(sortByMonthlyViews).slice(0, 8))
    }

    const pushRate = async (value) => {
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

        await axiosInstance.get(`/api/pointy/${testDetail?.id}/?&timestamp=${now}&public=true`)
            .then((req) => {
                lastRate = req.data.rate
                RateCount = req.data.rate_count
            })

        const view = {
            rate: lastRate == 0 ? 5 : (lastRate + value) / 2,
            rate_count: RateCount + 1
        }

        const headers = {
            'Authorization': "JWT " + authToken,
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }

        await axios.put(`/api/pointy/${testDetail?.id}/`, view, { headers })
            .then(res => {
                res.status == 200 &&
                    message.success('از نظر شما بسیار سپاس گذاریم')
            })
    }

    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header />

            <Helmet>
                <title>نتیجه تست | کوییزلند </title>
                <meta name="description" content="نتیجه تست انجام شده" />
                <meta name="keywords" content="کوییز, تست, کوییزلند" />
            </Helmet>

            <div className="result__container relative">
                <div className="flex justify-center result__title">
                    <h5 className="text-lg text-right">نتیجه {testDetail?.title}</h5>
                </div>
                <div className="flex justify-center beforeAfterDecor items-center">
                    <h1 className="text-center result__subtitle">{resultSubtitle}</h1>
                </div>

                {
                    resultImg &&
                    <div className='flex resultPointy__img'>
                        <img
                            src={resultImg}
                            width={690}
                            alt={testDetail?.subCategory}
                        />
                    </div>
                }

                {
                    resultText &&
                    <div className="mb-16 px-4 mt-5 wrapper-p darkGls"
                        dangerouslySetInnerHTML={{
                            __html: resultText
                        }}>
                    </div>
                }

                <div className='container px-20 mx-auto'>
                    <div className="text-center mb-4 space-sm">
                        <h5 className='text-lg'>{'ببین نتیجه ی تست دوستات چی در میاد  \n ببین شبیه هستید یا فرق دارید'}</h5>

                        <InlineShareButtons
                            config={{
                                alignment: 'center',
                                color: 'social',
                                enabled: true,
                                font_size: 16,
                                labels: 'null',
                                language: 'en',
                                networks: [
                                    'whatsapp',
                                    'telegram',
                                    'twitter',
                                    'sharethis',
                                ],
                                padding: 10,
                                radius: 10,
                                show_total: false,
                                size: 45,


                                url: window.location.href,
                                image: testDetail?.thumbnail,
                                title: testDetail?.title,
                            }}
                        />

                    </div>

                    <h2 className='flex justify-center text-lg items-center space-med'>این تست چطور بود؟</h2>

                    <Rate
                        character={({ index }) => customIcons[index + 1]}
                        allowClear={true}
                        disabled={rateChangeable ? false : true}
                        className='flex justify-center my-3 biggerRate'
                        onChange={value => {
                            const currentQuiz = testDetail.title
                            const lastRatedQuiz = localStorage.getItem('lastRatedQuiz')

                            // check if rated before (last time)
                            if (lastRatedQuiz == currentQuiz) {
                                message.warning('! شما قبلا به این تست امتیاز داده اید')
                            } else {
                                localStorage.setItem('lastRatedQuiz', currentQuiz)
                                pushRate(value)
                            }
                        }}
                    />

                </div>

            </div>

            <h2 className='text-center space-med beforeAfterDecor'>تست های مشابه</h2>

            {SkeletonLoading(contentLoaded)}

            <ul className="md:w-4/5 m-auto mt-5 flex flex-wrap align-baseline justify-center">
                {
                    suggestionQuizzes && <QuizContainer quizzes={suggestionQuizzes} bgStyle='trans' />
                }
            </ul>

            <BackBtn />

            <button onClick={tryAgainTheQuiz} className='tryAgain btn text-center px-2 py-1 rounded-lg' aria-label="Try Again The Quiz" type="button">انجام دادن دوباره تست</button>

            <Footer />

        </React.Fragment>
    );
}

export default Result;