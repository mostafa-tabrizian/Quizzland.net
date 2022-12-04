import React, { useEffect, useState } from 'react'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
const axios = require('axios')
import { useSnackbar } from 'notistack'
import Dialog from '@mui/material/Dialog'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { log, getTheme, replaceFunction, fadeIn, sortByMonthlyViews } from '../components/base'
import UserStore from '../store/userStore'
import axiosInstance from '../components/axiosAuthApi'
const LoginForm = React.lazy(() => import('../components/user/loginForm'))
const LoadingScreen = React.lazy(() => import('../components/loadingScreen'))
const TestContainer = React.lazy(() => import('../components/testContainer'))
const LikeCommentButton = React.lazy(() => import('../components/user/likeCommentButton'))

const Result = () => {
    const [resultScore, setResultScore] = useState(0)
    const [resultSubtitle, setResultSubtitle] = useState()
    const [resultImg, setResultImg] = useState()
    const [resultText, setResultText] = useState()
    const [loadState, setLoadState] = useState()
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()
    const [questionCount, setQuestionCount] = useState(null)
    const [correctAnswersCount, setCorrectAnswersCount] = useState(null)
    const [resultGif, setResultGif] = useState(null)
    const [popUpQuizSuggesterState, setPopUpQuizSuggester] = useState(false)

    const [quizDetail, setQuizDetail] = useState()

    const [userProfile, userActions] = UserStore()
    
    const { enqueueSnackbar } = useSnackbar()

    useEffect(async () => {
        if (JSON.parse(localStorage.getItem('qd')) === null) {
            window.location.href = "/404";
        }

        const quizResult = JSON.parse(localStorage.getItem('qr'))
        const quizDetail = JSON.parse(localStorage.getItem('qd'))
            
        setQuizDetail(quizDetail)
        detailOfResult(quizResult, quizDetail)
        setQuestionCount(quizResult.ql)
        setCorrectAnswersCount(quizResult.qc)
        getSuggestionsQuiz(quizDetail)
        userPlayedThisQuizBefore()
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
        setLoadState(true)
        
    }, [])

    useEffect(() => {
        {
            suggestionQuizzes &&
            showPopUpSuggestion()
        }
    }, [suggestionQuizzes])

    const userPlayedThisQuizBefore = async () => {
        if (!userProfile.userDetail) {
            return
        }

        const userHistory = await fetchUserHistory()
        let playedBefore = false

        for (let quizIndex in userHistory) {
            if (userHistory[quizIndex].test_id?.slug === quizDetail?.slug) {
                playedBefore = true
                break
            }
        }

        const lastIndex = userHistory.length - 1
        const previousUserPlayedQuiz = userHistory[lastIndex]?.test_id?.id

        if (quizDetail?.id !== previousUserPlayedQuiz) {
            postToHistoryAsPlayedQuiz()
        }
        
        return playedBefore
    }

    const fetchUserHistory = async () => {
        const now = new Date().getTime()

        return await axiosInstance.get(`/api/historyView/?timestamp=${now}`)
            .then(res => {
                return res.data
            })
            .catch(err => {
                log(err.response)
            })
    }

    const detailOfResult = (resultDetail, quizDetail) => {
        if (resultDetail <= quizDetail.result_upTo_10th) {
            setResultImg(quizDetail.result_img_10th)
            setResultSubtitle(quizDetail.result_title_10th)
            setResultText(quizDetail.result_text_10th)
        }
        else if (resultDetail <= quizDetail.result_upTo_9th) {
            setResultImg(quizDetail.result_img_9th)
            setResultSubtitle(quizDetail.result_title_9th)
            setResultText(quizDetail.result_text_9th)
        }
        else if (resultDetail <= quizDetail.result_upTo_8th) {
            setResultImg(quizDetail.result_img_8th)
            setResultSubtitle(quizDetail.result_title_8th)
            setResultText(quizDetail.result_text_8th)
        }
        else if (resultDetail <= quizDetail.result_upTo_7th) {
            setResultImg(quizDetail.result_img_7th)
            setResultSubtitle(quizDetail.result_title_7th)
            setResultText(quizDetail.result_text_7th)
        }
        else if (resultDetail <= quizDetail.result_upTo_6th) {
            setResultImg(quizDetail.result_img_6th)
            setResultSubtitle(quizDetail.result_title_6th)
            setResultText(quizDetail.result_text_6th)
        }
        else if (resultDetail <= quizDetail.result_upTo_5th) {
            setResultImg(quizDetail.result_img_5th)
            setResultSubtitle(quizDetail.result_title_5th)
            setResultText(quizDetail.result_text_5th)
        }
        else if (resultDetail <= quizDetail.result_upTo_4th) {
            setResultImg(quizDetail.result_img_4th)
            setResultSubtitle(quizDetail.result_title_4th)
            setResultText(quizDetail.result_text_4th)
        }
        else if (resultDetail <= quizDetail.result_upTo_3rd) {
            setResultImg(quizDetail.result_img_3rd)
            setResultSubtitle(quizDetail.result_title_3rd)
            setResultText(quizDetail.result_text_3rd)
        }
        else if (resultDetail <= quizDetail.result_upTo_2nd) {
            setResultImg(quizDetail.result_img_2nd)
            setResultSubtitle(quizDetail.result_title_2nd)
            setResultText(quizDetail.result_text_2nd)
        }
        else if (resultDetail <= quizDetail.result_upTo_1st) {
            setResultImg(quizDetail.result_img_1st)
            setResultSubtitle(quizDetail.result_title_1st)
            setResultText(quizDetail.result_text_1st)
        }
    }

    const showLoginNotification = () => {
        enqueueSnackbar(
            <div className='mt-8'>
                <h5 className='mb-5'>
                    برای لایک و کامنت کردن لازمه که اول وارد کوییزلند بشی.
                </h5>
                <div className='rounded-xl w-fit'>
                    <LoginForm />
                </div>
            </div>,
            { 
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
                preventDuplicate: true
            }
        )
    };

    const getSuggestionsQuiz = async (quizDetail) => {
        let pointy = await axios.get(`/api/testView/?subCategory__iexact=${replaceFunction(quizDetail?.subCategory, ' ', '+')}&limit=8&public=true`)
        let content = pointy.data.results

        if (content.length == 1) {
            pointy = await axios.get(`/api/testView/?category__iexact=${replaceFunction(quizDetail?.categoryKey.title_english, ' ', '+')}&limit=8&public=true`)
            content = pointy.data.results
        }

        setSuggestionQuizzes(content.slice(0, 8).sort(sortByMonthlyViews))
    }

    const showPopUpSuggestion = () => {
        setTimeout(() => {
            setPopUpQuizSuggester(true)
            setTimeout(() => {
                fadeIn(document.querySelector('.result__popUpQuizSuggester__closeBtn'))
            }, 2_000)
        }, 7_000)
    }

    const chooseUniqueQuizToSuggest = () => {
        if (suggestionQuizzes) {
            if (suggestionQuizzes[0]?.title === quizDetail?.title) {
                if (suggestionQuizzes[1]) {
                    return suggestionQuizzes[1]
                }
                else {  // there is no unique quiz, don't show the pop up
                    setSuggestionQuizzes(false)
                    return suggestionQuizzes[0]
                }
            }
            else {
                return suggestionQuizzes[0]
            }
        }
    }

    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Helmet>
                <title>نتیجه کوییز | کوییزلند </title>
                <meta name="description" content="نتیجه کوییز انجام شده" />
                <meta name="keywords" content="کوییز, کوییزلند" />
            </Helmet>

            <div className='ltr'>
                <div className="relative result__container">
                    <div className="flex justify-center mx-10 opacity-50 mb-9">
                        <h5 className="text-right">نتیجه  {quizDetail?.title}</h5>
                    </div>
                    <div className="flex items-center justify-center beforeAfterDecor">
                        <h1 className="text-xl text-center">{resultSubtitle}</h1>
                    </div>

                    <div>
                        {
                            resultImg &&
                            <div className='flex resultPointy__img'>
                                <img
                                    src={resultImg}
                                    width={690}
                                    alt={quizDetail?.subCategory}
                                />
                            </div>
                        }
                        {
                            resultText &&
                            <div className="px-4 mt-5 mb-16 leading-10 wrapper-p"
                                dangerouslySetInnerHTML={{
                                    __html: resultText
                                }}>
                            </div>
                        }

                        <Link to='/' className={`mx-auto flex justify-center`}>
                            بازگشت به صفحه اصلی
                        </Link>
                    </div>
                    

                    {/* <div className='container px-20 mx-auto'>
                        <div className="mb-4 text-lg text-center space-sm">
                            <h5>{`دوستات رو به چالش بکش  \n ببین در حد تو ${quizDetail.fan_name} هستن`}</h5>
                        </div>
                    </div> */}
                </div>

                {quizDetail?.id && <LikeCommentButton quizId={quizDetail?.id} quizType='test' showLoginNotification={showLoginNotification} />}

                <div className='mx-4 mt-10'>
                    <h2 className='text-lg text-center space-med beforeAfterDecor'>کوییز های مشابه</h2>

                    <ul className="flex flex-col md:flex-row flex-wrap md:w-[70rem] mx-auto my-10">
                        {
                            suggestionQuizzes && <TestContainer tests={suggestionQuizzes} bgStyle='trans' />
                        }
                    </ul>
                </div>

                {
                    chooseUniqueQuizToSuggest() &&
                    <Dialog
                        open={popUpQuizSuggesterState}
                        aria-labelledby="پیشنهاد کوییز"
                        aria-describedby="پیشنهاد برای کوییز بعدیت"
                    >
                        
                        <div className='bg-gradient-to-t from-[#771118] to-[#ac272e] p-8 rounded-lg'>
                            <button className='absolute text-3xl result__popUpQuizSuggester__closeBtn fadeOut left-4 top-4' onClick={() => setPopUpQuizSuggester(false)}>
                                <svg class="h-6 w-6 text-white"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>

                            <div>
                                <h3 className='text-lg text-[#ffb3b3]'>پیشنهاد برای کوییز بعدیت :</h3>

                                <Link to={`/quiz/${replaceFunction(chooseUniqueQuizToSuggest()?.slug, ' ', '-')}`}>
                                    <h2 className="flex text-lg text-white result__popUpQuizSuggester__title">
                                        {chooseUniqueQuizToSuggest()?.title}
                                    </h2>
                                </Link>
                            </div>
                            <Link to={`/quiz/${replaceFunction(chooseUniqueQuizToSuggest()?.slug, ' ', '-')}`}>
                                <div className='mt-5 overflow-hidden rounded-lg shadow-[0_0_10px_black]'>
                                    <LazyLoadImage
                                        src={chooseUniqueQuizToSuggest()?.thumbnail}
                                        alt={`${chooseUniqueQuizToSuggest()?.subCategory} | ${chooseUniqueQuizToSuggest()?.title}`}
                                        className='object-cover w-full'
                                        effect="blur"
                                    />
                                </div>
                            </Link>
                        </div>
                    </Dialog>
                }

            </div>

        </React.Fragment>
    );
}

export default Result;