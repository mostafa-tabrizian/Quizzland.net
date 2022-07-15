import React, { useEffect, useState } from 'react'
import { message, notification } from 'antd';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'
import { InlineShareButtons } from 'sharethis-reactjs';

import axiosInstance from '../components/axiosApi';
import Header from '../components/header'
import Footer from '../components/footer'

import { log, getTheme, replaceFunction, fadeIn, popUpShow, popUpHide, sortByMonthlyViews } from '../components/base'
import LoadingScreen from '../components/loadingScreen'
import QuizContainer from '../components/quizContainer'
import skeletonQuiz from '../components/skeletonQuiz';
import userProfileDetail from '../components/user/userProfileDetail';
import LikeCommentButton from '../components/user/likeCommentButton';
import AddView from '../components/addView';

const Result = () => {
    const [resultScore, setResultScore] = useState(0)
    const [resultSubtitle, setResultSubtitle] = useState()
    const [resultImg, setResultImg] = useState()
    const [resultText, setResultText] = useState()
    const [loadState, setLoadState] = useState()
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    const [questionCount, setQuestionCount] = useState(null)
    const [correctAnswersCount, setCorrectAnswersCount] = useState(null)
    const [resultGif, setResultGif] = useState(null)
    const [quizType, setQuizType] = useState(null)
    const [popUpQuizSuggesterState, setPopUpQuizSuggester] = useState(false)

    const [quizResult, setQuizResult] = useState()
    const [quizDetail, setQuizDetail] = useState()

    let userDetail

    useEffect(async () => {
        if (JSON.parse(localStorage.getItem('qd')) === null) {
            window.location.href = "/404";
        }

        const quizResult = JSON.parse(localStorage.getItem('qr'))
        const quizDetail = JSON.parse(localStorage.getItem('qd'))
        const quizType = localStorage.getItem('qt')
            
        setQuizType(quizType)
        setQuizResult(quizResult)
        setQuizDetail(quizDetail)
        detailOfResult(quizResult, quizDetail, quizType)
        setQuestionCount(quizResult.ql)
        setCorrectAnswersCount(quizResult.qc)
        setContentLoaded(true)
        AddView(quizType, quizDetail.id)
        getSuggestionsQuiz(quizDetail?.subCategory)
        document.querySelector('body').style = `background: ${getTheme() == 'dark' ? '#060101' : 'white'}`
        setLoadState(true)
        
        userDetail = await userProfileDetail()
        const score = calculateTheResultScore(quizResult, quizType)
        
        if (userDetail != undefined) {
            postToHistoryAsPlayedQuiz(userDetail, quizDetail.id, quizType)
            giveScorePoint(quizType, quizDetail.id, score)
        } else {
            displayMessageToUserAboutScore(score)
        }
        
    }, [])

    useEffect(() => {
        {
            suggestionQuizzes &&
            showPopUpSuggestion()
        }
    }, [suggestionQuizzes])

    const userPlayedThisQuizBefore = (quizType, quizId) => {
        return userDetail.played_history.split('_').includes(String(quizId) + quizType.slice(0, 1))
    }

    const displayMessageToUserAboutScore = (score) => {
        const key = `open${Date.now()}`;
        const btn = (
            <div className='flex space-x-5 space-x-reverse'>
                <button className='px-4 py-2 border rounded-xl'>
                    <a href='/login'>
                        دریافت امتیاز
                    </a>
                </button>
                <button onClick={() => notification.close(key)}>
                    بی خیال
                </button>
            </div>
        );
        notification.open({
            message: '',
            description:

                <h5>
                    {score} امتیاز به شما تعلق گرفت. برای گرفتن آن حتما باید وارد حساب کاربریتان شوید!
                </h5>,
            duration: 0,
            style: {
                background: '#ac272e',
                color: 'white',
                borderRadius: '15px'
            },
            btn,
            key,
            onClose: close,
        });
    }

    const decideHowMucHPointToGive = (score) => {
        const integerScore = parseInt(score)
        let giveAmountPoint = 0
        
        if (integerScore <= 20) {
            giveAmountPoint = 0
        }
        else if (integerScore <= 40){
            giveAmountPoint = 50
        }
        else if (integerScore <= 60){
            giveAmountPoint = 100
        }
        else if (integerScore <= 80){
            giveAmountPoint = 200
        }
        else if (integerScore <= 100){
            giveAmountPoint = 300
        }
        
        return giveAmountPoint
    }
    
    const giveScorePoint = async (quizType, quizId, score) => {
        const giveAmountPoint = decideHowMucHPointToGive(score)
        
        if (giveAmountPoint !== 0 && !userPlayedThisQuizBefore(quizType, quizId)) {
            await axiosInstance.patch(`/api/user/${userDetail.id}/`, { points: userDetail.points + parseInt(giveAmountPoint) })
                .then(res => {
                    res.status == 200 &&
                        message.success(`${giveAmountPoint} امتیاز به شما تعلق گرفت 🎉`)
                })
                .catch(err => {
                    log(err.response)
                })
        }
    }

    const calculateTheResultScore = (resultDetail, quizType) => {
        let score
        
        switch (quizType) {
            case 'quiz':
                const questionsCounter = resultDetail.ql
                const correctAnswersCount = resultDetail.qc
        
                score = ((correctAnswersCount / questionsCounter) * 100).toFixed(0)
                break
            
            case 'test':
                score = 80
            break
        }

        return score
    }

    const detailOfResult = (resultDetail, quizDetail, quizType) => {
        switch (quizType) {
            case 'quiz':
                const quizScore = calculateTheResultScore(resultDetail, quizType)
                if (quizScore > 80) {
                    setResultScore(`😎 ${quizScore}%`)
                    setResultSubtitle(`🤯 واااو، تو دیگه کی هستی ترکوندی`)
                    setResultGif(quizDetail.GIF100)
                }
                else if (quizScore > 60) {
                    setResultScore(`😎 ${quizScore}%`)
                    setResultSubtitle(`😎 ایول\n! تو یک ${quizDetail.fanName} واقعی هستی `)
                    setResultGif(quizDetail.GIF80)
                }
                else if (quizScore > 40) {
                    setResultScore(`🙂 ${quizScore}%`)
                    setResultSubtitle('عالیه، فقط یکم با یه فن بودن فاصله داری')
                    setResultGif(quizDetail.GIF60)
                }
                else if (quizScore > 20) {
                    setResultScore(`😉 ${quizScore}%`)
                    setResultSubtitle('بیشتر تلاش کن. میتونی انجامش بدی')
                    setResultGif(quizDetail.GIF40)
                }
                else if (quizScore >= 0) {
                    setResultScore(`😭 ${quizScore}%`)
                    setResultSubtitle('😅 میتونی سریع کوییز رو از اول بدی تا کسی نیومده\n😀 یا کوییز رو کلا عوض کنی بری بعدی')
                    setResultGif(quizDetail.GIF20)
                }
                else {
                    setResultScore(`👀`)
                    setResultSubtitle('😰 خطا در محاسبه امتیاز\n.لطفا بعدا امتحان کنید و یا در غیر اینصورت به پشتیبانی اطلاع دهید')
                    setResultGif(quizDetail.GIF20)
                }
                break
            case 'test':
                if (resultDetail <= quizDetail.result_upTo_1st) {
                    setResultImg(quizDetail.result_img_1st)
                    setResultSubtitle(quizDetail.result_title_1st)
                    setResultText(quizDetail.result_text_1st)
                }
                else if (resultDetail <= quizDetail.result_upTo_2nd) {
                    setResultImg(quizDetail.result_img_2nd)
                    setResultSubtitle(quizDetail.result_title_2nd)
                    setResultText(quizDetail.result_text_2nd)
                }
                else if (resultDetail <= quizDetail.result_upTo_3rd) {
                    setResultImg(quizDetail.result_img_3rd)
                    setResultSubtitle(quizDetail.result_title_3rd)
                    setResultText(quizDetail.result_text_3rd)
                }
                else if (resultDetail <= quizDetail.result_upTo_4th) {
                    setResultImg(quizDetail.result_img_4th)
                    setResultSubtitle(quizDetail.result_title_4th)
                    setResultText(quizDetail.result_text_4th)
                }
                else if (resultDetail <= quizDetail.result_upTo_5th) {
                    setResultImg(quizDetail.result_img_5th)
                    setResultSubtitle(quizDetail.result_title_5th)
                    setResultText(quizDetail.result_text_5th)
                }
                else if (resultDetail <= quizDetail.result_upTo_6th) {
                    setResultImg(quizDetail.result_img_6th)
                    setResultSubtitle(quizDetail.result_title_6th)
                    setResultText(quizDetail.result_text_6th)
                }
                else if (resultDetail <= quizDetail.result_upTo_7th) {
                    setResultImg(quizDetail.result_img_7th)
                    setResultSubtitle(quizDetail.result_title_7th)
                    setResultText(quizDetail.result_text_7th)
                }
                else if (resultDetail <= quizDetail.result_upTo_8th) {
                    setResultImg(quizDetail.result_img_8th)
                    setResultSubtitle(quizDetail.result_title_8th)
                    setResultText(quizDetail.result_text_8th)
                }
                else if (resultDetail <= quizDetail.result_upTo_9th) {
                    setResultImg(quizDetail.result_img_9th)
                    setResultSubtitle(quizDetail.result_title_9th)
                    setResultText(quizDetail.result_text_9th)
                }
                else if (resultDetail <= quizDetail.result_upTo_10th) {
                    setResultImg(quizDetail.result_img_10t)
                    setResultSubtitle(quizDetail.result_title_10th)
                    setResultText(quizDetail.result_text_10th)
                }
                break
        }
    }

    const getSuggestionsQuiz = async (subCategory) => {
        const quiz = await axiosInstance.get(`/api/quiz/?subCategory=${replaceFunction(subCategory, ' ', '+')}&limit=8&public=true`)
        const pointy = await axiosInstance.get(`/api/test/?subCategory=${replaceFunction(subCategory, ' ', '+')}&limit=8&public=true`)
        let content = quiz.data.results.concat(pointy.data.results)

        setSuggestionQuizzes(content.sort(sortByMonthlyViews).slice(0, 8))
        setContentLoaded(true)
    }

    const showPopUpSuggestion = () => {
        setTimeout(() => {
            popUpShow(document.querySelector('.result__popUpQuizSuggester'))
            setPopUpQuizSuggester(true)
            document.querySelector('.result__popUpQuizSuggester').style.pointerEvents = 'all'
            document.querySelector('body').style.overflow = 'hidden'
            document.querySelector('#land').style.pointerEvents = 'none'
            document.querySelector('#land').style.overflow = 'none'
            
            setTimeout(() => {
                fadeIn(document.querySelector('.result__popUpQuizSuggester__closeBtn'))
            }, 2000)
            
        }, 10_000)  //! 10_000  
    }

    const closePopUpQuizSuggester = () => {
        popUpHide(document.querySelector('.result__popUpQuizSuggester'))
        setPopUpQuizSuggester(false)
        document.querySelector('.result__popUpQuizSuggester').style.pointerEvents = 'none'
        document.querySelector('body').style.overflow = 'auto'
        document.querySelector('#land').style.pointerEvents = 'all'
        document.querySelector('#land').style.overflow = 'all'
    }

    const chooseUniqueQuizToSuggest = () => {
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

    const postToHistoryAsPlayedQuiz = async (userDetail, quizId, quizType) => {
        await axiosInstance.patch(`/api/user/${userDetail.id}/`, { played_history: userDetail.played_history + `_${quizId}${quizType.slice(0, 1)}` })
        // .then(res => {
        // })
        .catch(err => {
            log(err.response)
        })
    }

    const returnQuizResult = () => {
        switch (quizType) {
            case 'quiz':
                return <div className="items-center justify-center block w-full mx-auto result md:container space-sm md:flex">
                            <div className="flex items-center justify-center result__img md:mx-16">
                                {<img src={resultGif} className='object-contain rounded-lg' width={540} alt={resultGif} />}
                            </div>
                            <div className="mt-5">
                                <h5 className='result_score'>
                                    {resultScore}
                                </h5>
                            </div>
                            <div className="mt-5 result_detail">
                                <h5>پاسخ 🟢: <span>{correctAnswersCount}</span></h5>
                                <h5>پاسخ 🔴: <span>{questionCount - correctAnswersCount}</span></h5>
                            </div>
                        </div>
            case 'test':
                return <div>
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
                                <div className="px-4 mt-5 mb-16 leading-10 wrapper-p darkGls"
                                    dangerouslySetInnerHTML={{
                                        __html: resultText
                                    }}>
                                </div>
                            }
                        </div>
        }
    }

    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header />

            <Helmet>
                <title>نتیجه کوییز | کوییزلند </title>
                <meta name="description" content="نتیجه کوییز انجام شده" />
                <meta name="keywords" content="کوییز, کوییزلند" />
            </Helmet>

            <div className={`ltr ${popUpQuizSuggesterState ? 'focusBlur' : ''}`}>
                <div className="relative result__container">
                    <div className="flex justify-center result__title">
                        <h5 className="text-right">نتیجه  {quizDetail?.title}</h5>
                    </div>
                    <div className="flex items-center justify-center beforeAfterDecor">
                        <h1 className="text-center result__subtitle">{resultSubtitle}</h1>
                    </div>

                    {returnQuizResult()}

                    <div className='container px-20 mx-auto'>
                        <div className="mb-4 text-lg text-center space-sm">
                            {/* <h5>{`دوستات رو به چالش بکش  \n ببین در حد تو ${quizDetail.fanName} هستن`}</h5> */}

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
                                    image: quizDetail?.thumbnail,
                                    title: quizDetail?.title1,
                                }}
                            />

                        </div>
                    </div>
                </div>

                <LikeCommentButton quizId={quizDetail?.id} quizType={quizType} />

                <h2 className='text-lg text-center space-med beforeAfterDecor'>کوییز های مشابه</h2>

                <div className='w-3/4 mx-auto'>
                    {skeletonQuiz(contentLoaded)}
                </div>

                <ul className="flex flex-wrap md:w-[70rem] mx-auto my-10">
                    {
                        suggestionQuizzes && <QuizContainer quizzes={suggestionQuizzes} bgStyle='trans' />
                    }
                </ul>

                {
                    suggestionQuizzes && chooseUniqueQuizToSuggest() &&
                    <div className='noBlur result__popUpQuizSuggester fixed z-10 popUp-hide bg-gradient-to-t from-[#771118] to-[#ac272e] p-8 w-11/12 md:w-[42rem] mx-8 grid grid-cols-1 rounded-lg pointer-events-none'>
                        <button className='absolute text-3xl noBlur result__popUpQuizSuggester__closeBtn left-4 top-4' onClick={() => {
                            closePopUpQuizSuggester();
                        }}> X </button>

                        <div className='noBlur'>
                            <h3 className='noBlur result__popUpQuizSuggester__headline text-lg text-[#ffb3b3]'>پیشنهاد برای کوییز بعدیت :</h3>

                            <Link className='noBlur' to={`/quiz/${replaceFunction(chooseUniqueQuizToSuggest().slug, ' ', '-')}`}>
                                <h3 className="flex text-lg noBlur result__popUpQuizSuggester__title">
                                    {chooseUniqueQuizToSuggest().title}
                                </h3>
                            </Link>
                        </div>
                        <Link className='noBlur' to={`/quiz/${replaceFunction(chooseUniqueQuizToSuggest().slug, ' ', '-')}`}>
                            <div className='noBlur result__popUpQuizSuggester__thumbnail mt-5 overflow-hidden rounded-lg shadow-[0_0_10px_black] h-[11rem] md:h-[21rem]'>
                                <img
                                    src={chooseUniqueQuizToSuggest().thumbnail}
                                    alt={`${chooseUniqueQuizToSuggest().subCategory} | ${chooseUniqueQuizToSuggest().title}`}
                                    width={1920}
                                    height={1080}
                                    className='object-cover noBlur'
                                />
                            </div>
                        </Link>
                    </div>
                }
            </div>
            
            <Footer />

        </React.Fragment>
    );
}

export default Result;