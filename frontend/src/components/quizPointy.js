import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { Helmet } from "react-helmet";
import {StickyShareButtons} from 'sharethis-reactjs';
import rateLimit from 'axios-rate-limit';

import { log, replaceFunction, isItDesktop, isItMobile } from './base'
import Header from './hotHeader'
import LoadingScreen from './loadingScreen'
import QuizPointyContainer from './quizPointyContainer'
import SkeletonLoading from './skeletonLoading'

const logo = '/static/img/Q-small.png'

let quiz = 'null'

const Quiz = () => {
    const [questions, setQuestions] = useState([])
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
    const [currentMoveOfQuestions, setCurrentMoveOfQuestions] = useState(0)
    const [autoQuestionChanger, setAutoQuestionChanger] = useState(false)
    const [quizEnded, setQuizEnded] = useState(false)
    const [loadState, setLoadState] = useState()
    const [quizTitle, setQuizTitle] = useState(window.document.URL.split('/')[4])
    const [contentLoaded, setContentLoaded] = useState(false)
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()
    const [quizThumbnail, setQuizThumbnail] = useState()
    const [ableToGoNext, setAbleToGoNext] = useState(false)
    const [SFXAllowed, setSFXAllowed] = useState()
    const speakerIconOn = '/static/img/speakerOn.png'
    const speakerIconOff = '/static/img/speakerOff.png'

    const result = useRef(null)

    const quizTitleReplacedWithHyphen = replaceFunction(quizTitle, '-', '+')
    const SFXClick = new Audio('../../static/sound/SFXClick.mp3')

    useEffect(() => {
        grabData()
        setLoadState(true)
        SFXLocalStorage()
    }, quizTitle)

    useEffect(() => {
        quizChangeDetector()
    })

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 8, perMilliseconds: 1000, maxRPS: 150 })

    const SFXLocalStorage = () => {
        if (localStorage.getItem('SFXAllowed')) {
            setSFXAllowed(localStorage.getItem('SFXAllowed'))
        } else {
            localStorage.setItem('SFXAllowed', 'true')
            setSFXAllowed('true')
        }
    }

    const quizChangeDetector = () => {
        (function(history){

            let pushState = history.pushState;
            history.pushState = function() {
                pushState.apply(history, arguments);
            };

            setQuizTitle(replaceFunction(window.location.pathname.split('/')[2], '-', '+'))

        })(window.history);
    }

    const setBackground = () => {
        document.getElementById('html').style=`background: url('${quiz.background}') center/cover no-repeat fixed !important`
    }
    
    const grabData = () => {
        
        const grabQuiz = async () => {
            const quizDB = await axiosLimited.get(`/dbAPI/new_pointy_quiz/?title__iexact=${quizTitleReplacedWithHyphen}&limit=1`)
            quiz = quizDB.data.results[0]
            return quiz
        }
        
        const grabQuestions = async () => {
            return await axiosLimited.get(`/dbAPI/pointyQuestions/?title__iexact=${quizTitleReplacedWithHyphen}`)
        }
        
        grabQuiz().then((quiz) => {
            try {
                setQuizThumbnail(quiz.thumbnail)
                setBackground()
            }
            catch (e) {
                window.location.href = "/404";
            }
        })

        grabQuestions().then((question) => {
            setQuestions(question.data)
            getSuggestionsQuiz(question.data[0].subCategory)
            setContentLoaded(true)
        })
    }

    const makeDatePublishFormatForDetailInHead = (fullDate) => {
        if (fullDate) {
            const year = parseInt(fullDate.slice(0, 4))
            const month = parseInt(fullDate.slice(5, 7)) - 1
            const day = parseInt(fullDate.slice(8, 10))
            const hour = parseInt(fullDate.slice(11, 13))
            const minute = parseInt(fullDate.slice(14, 16))
            const second = parseInt(fullDate.slice(17, 20))

            const newDate = new Date(year, month, day, hour, minute, second)
            const persianDate = newDate.toLocaleDateString('fa-IR').split('/')
            
            let monthsInPersian

            switch (persianDate[1]) {
                case '۱':
                    monthsInPersian = 'فروردين'
                    break;
                case '۲':
                    monthsInPersian = 'ارديبهشت'
                    break
                case '۳':
                    monthsInPersian = 'خرداد'
                    break
                case '۴':
                    monthsInPersian = 'تير'
                    break
                case '۵':
                    monthsInPersian = 'مرداد'
                    break
                case '۶':
                    monthsInPersian = 'شهريور'
                    break
                case '۷':
                    monthsInPersian = 'مهر'
                    break
                case '۸':
                    monthsInPersian = 'آبان'
                    break
                case '۹':
                    monthsInPersian = 'آذر'
                    break
                case '۱۰':
                    monthsInPersian = 'دي'
                    break
                case '۱۱':
                    monthsInPersian = 'بهمن'
                    break
                case '۱۲':
                    monthsInPersian = 'اسفند'
                    break
            }

            return `${persianDate[2]} ${monthsInPersian} ${persianDate[0]}`
        }
    }

    const playSFX = () => {
        const SFXAllowed = localStorage.getItem('SFXAllowed')
        if (SFXAllowed === 'true') {
            SFXClick.volume = .5
            SFXClick.play()
        }
    }

    const selectedOption = (props) => {
        playSFX()
        takeSelectedOptionValue(props.target)

        if (autoQuestionChanger) {
            automaticallyGoNextQuestionOrEndTheQuiz()
        } else {
            setAbleToGoNext(true)
        }
    }

    const takeSelectedOptionValue = (userSelection) => {
        let userChose = userSelection.id
        const currentQuestionNumber = parseInt(userChose.split('-')[0])

        for(let i = 1; i <= 10; i++) {
            if (document.getElementById(`inputLabel ${currentQuestionNumber}-${i}`)) {
                document.getElementById(`inputLabel ${currentQuestionNumber}-${i}`).style.opacity = .5
                document.getElementById(`inputLabel ${currentQuestionNumber}-${i}`).style.borderColor = 'white'
            }
        }

        document.getElementById(`inputLabel ${userChose}`).style.opacity = 1
        document.getElementById(`inputLabel ${userChose}`).style.background = '#000000bf'
        document.getElementById(`inputLabel ${userChose}`).style.borderColor = '#6a0d11'
    }

    const automaticallyGoNextQuestionOrEndTheQuiz = () => {
        setTimeout(() => {
            goNextQuestionOrEndTheQuiz()
        }, 1500);
    }


    const questionShowIfNotNull = (question) => {
        if (question !== null) {
            return <p className='quiz__question tx-al-c'> { question } </p>
        }
    }

    const questionOptionsCheckBetweenStringOrImg = (question) => {
        if (question.option_1st) {
            return (
                <div className="flex flex-jc-c">
                    <form className='quiz__options quiz__options__text' action="">
                        { question.option_1st !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-1`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${question.id}-1`} htmlFor={`${question.id}-1`}> { question.option_1st } </label> </React.Fragment> }
                        { question.option_2nd !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-2`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${question.id}-2`} htmlFor={`${question.id}-2`}> { question.option_2nd } </label> </React.Fragment> }
                        { question.option_3rd !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-3`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${question.id}-3`} htmlFor={`${question.id}-3`}> { question.option_3rd } </label> </React.Fragment> }
                        { question.option_4th !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-4`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${question.id}-4`} htmlFor={`${question.id}-4`}> { question.option_4th } </label> </React.Fragment> }
                        { question.option_5th !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-5`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${question.id}-5`} htmlFor={`${question.id}-5`}> { question.option_5th } </label> </React.Fragment> }
                        { question.option_6th !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-6`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${question.id}-6`} htmlFor={`${question.id}-6`}> { question.option_6th } </label> </React.Fragment> }
                        { question.option_7th !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-7`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${question.id}-7`} htmlFor={`${question.id}-7`}> { question.option_7th } </label> </React.Fragment> }
                        { question.option_8th !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-8`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${question.id}-8`} htmlFor={`${question.id}-8`}> { question.option_8th } </label> </React.Fragment> }
                        { question.option_9th !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-9`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${question.id}-9`} htmlFor={`${question.id}-9`}> { question.option_9th } </label> </React.Fragment> }
                        { question.option_10th !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-10`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${question.id}-10`} htmlFor={`${question.id}-10`}> { question.option_10th } </label> </React.Fragment> }
                    </form>
                </div>
            )
        } else {
            return (
                <div className="flex flex-jc-c">
                    <form className='quiz__options quiz__options__img grid flex-jc-c pos-rel' data={question.answer} action="">
                        { !(question.option_img_1st.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-1`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${question.id}-1`} htmlFor={`${question.id}-1`}> <img className="quiz__imgOption" src={question.option_img_1st} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { !(question.option_img_2nd.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-2`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${question.id}-2`} htmlFor={`${question.id}-2`}> <img className="quiz__imgOption" src={question.option_img_2nd} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { !(question.option_img_3rd.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-3`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${question.id}-3`} htmlFor={`${question.id}-3`}> <img className="quiz__imgOption" src={question.option_img_3rd} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { !(question.option_img_4th.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-4`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${question.id}-4`} htmlFor={`${question.id}-4`}> <img className="quiz__imgOption" src={question.option_img_4th} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { !(question.option_img_5th.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-5`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${question.id}-5`} htmlFor={`${question.id}-5`}> <img className="quiz__imgOption" src={question.option_img_5th} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { !(question.option_img_6th.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-6`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${question.id}-6`} htmlFor={`${question.id}-6`}> <img className="quiz__imgOption" src={question.option_img_6th} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { !(question.option_img_7th.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-7`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${question.id}-7`} htmlFor={`${question.id}-7`}> <img className="quiz__imgOption" src={question.option_img_7th} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { !(question.option_img_8th.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-8`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${question.id}-8`} htmlFor={`${question.id}-8`}> <img className="quiz__imgOption" src={question.option_img_8th} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { !(question.option_img_9th.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-9`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${question.id}-9`} htmlFor={`${question.id}-9`}> <img className="quiz__imgOption" src={question.option_img_9th} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { !(question.option_img_10th.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-10`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${question.id}-10`} htmlFor={`${question.id}-10`}> <img className="quiz__imgOption" src={question.option_img_10th} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                    </form>
                </div>
            )
        }
    }

    const isSafari = navigator.userAgent.indexOf("Chrome")!=-1 === false && navigator.userAgent.indexOf("Chrome")!=-1

    const quizQuestions = () => {
        return (
            questions.map(question => {
                return (
                    <div style={{transform: `translate(${currentMoveOfQuestions}rem)`, WebkitTransform: `translate(${currentMoveOfQuestions}rem)`}} className="quiz__container pos-rel darkGls">

                        { questionShowIfNotNull(question.question) }

                        { !question.question_img.includes('NotExist') && <img className="quiz__imgQuestion" src={question.question_img} alt={question.title} loading='lazy' /> }
                    
                        { questionOptionsCheckBetweenStringOrImg(question) }
                        
                    </div>
                )
            })
        )
    }

    const quizQuestionsForSafari = () => {
        return (
            questions.map(question => {
                return (
                    <div style={{left: `${currentMoveOfQuestions}rem`}} className="quiz__container pos-rel darkGls">

                        { questionShowIfNotNull(question.question) }

                        { !question.question_img.includes('NotExist') && <img className="quiz__imgQuestion" src={question.question_img} alt={question.title}/> } {/* loading='lazy' */}
                    
                        { questionOptionsCheckBetweenStringOrImg(question) }
                        
                    </div>
                )
            })
        )
    }

    const plusOneToTotalAnsweredQuestions = () => {
        setCurrentQuestionNumber(prev => prev + 1)
    }

    const minusOneToTotalAnsweredQuestions = () => {
        setCurrentQuestionNumber(prev => prev - 1)
    }
    
    let sumOfTheWidthMarginAndPaddingOfQuestionForSliding
    if (window.navigator.userAgent.includes('Windows') || window.navigator.userAgent.includes('iPad')) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 48
    } 
    else if (window.navigator.userAgent.includes('Mobile')) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 23.5
    }

    const calculateThePoints = () => {
        const allOptions = document.querySelectorAll('input[type=radio]')
        const optionPoints = ['option_point_1st', 'option_point_2nd', 'option_point_3rd', 'option_point_4th', 'option_point_5th', 'option_point_6th', 'option_point_7th', 'option_point_8th', 'option_point_9th', 'option_point_10th']
        
        const firstQuestionId = allOptions[0].getAttribute('id')
        const firstQuestionIndex = parseInt(firstQuestionId.split('-')[0])
        
        let totalPoints = 0
        for (let i = 0; i < allOptions.length; i++) {
            const questionId = allOptions[i].getAttribute('id')
            const currentQuestionId = parseInt(questionId.split('-')[0])
            const currentQuestionNumber = currentQuestionId - firstQuestionIndex
            const OptionSelected = parseInt(questionId.split('-')[1]) - 1
            
            if (allOptions[i].checked) {
                const pointOfOptions = questions[currentQuestionNumber][optionPoints[OptionSelected]]
                totalPoints += pointOfOptions
            }
        }
        
        return totalPoints
    }

    const goNextQuestionOrEndTheQuiz = () => {
        if (ableToGoNext || autoQuestionChanger) {
            setAbleToGoNext(false)
            if (currentQuestionNumber !== questions.length) {
                plusOneToTotalAnsweredQuestions()
                setCurrentMoveOfQuestions(prev => prev - sumOfTheWidthMarginAndPaddingOfQuestionForSliding)

            } else {
                setQuizEnded(true)
                setTimeout(() => {
                    try {
                        localStorage.setItem('resultQuiz',  JSON.stringify(quiz))
                        localStorage.setItem('testResult', calculateThePoints())
                        result.current.click()
                    } catch{
                        log("Can't show the result from localStorage!")
                    }
                }, 3500)
            }
        }
    }

    const goLastQuestion = () => {
        if (currentQuestionNumber !== 1) {
            minusOneToTotalAnsweredQuestions()
            setCurrentMoveOfQuestions(prev => prev + sumOfTheWidthMarginAndPaddingOfQuestionForSliding)

        }
    }

    const showTheTagsIfNotNull = () => {
        if (quiz !== 'null') {
            const tags = quiz.tags
            const splittedTags = tags.split('،')
            return (    
                splittedTags.map(tag => {
                    return <li><h2><Link rel='tag' to={`/search?s=r${replaceFunction(tag, ' ', '+')}`} >{tag}</Link></h2></li>
                })
            )
        }
    }

    const getSuggestionsQuiz = (subCategory) => {
        axiosLimited.get(`/dbAPI/new_pointy_quiz/?subCategory__icontains=${replaceFunction(subCategory, ' ', '+')}&limit=8`)
        .then((res) => {setSuggestionQuizzes(res.data.results)})
    }

    const SFXController = () => {
        const changeToThis = SFXAllowed === 'true' ? 'false' : 'true'
        setSFXAllowed(changeToThis)
        localStorage.setItem('SFXAllowed', changeToThis)
    }

    const currentUrl = () => {
        if (quiz.title) {
            return `https://www.quizzland.net/test/${replaceFunction(quiz.title, ' ', '-')}`
        } 
    }

    let firstTouch
    const touchScreenStart = (e) => {
        const positionOfStartTouch = e.changedTouches[0].clientX
        firstTouch = positionOfStartTouch
    }

    const touchScreenEnd = (e) => {
        const positionOfEndTouch = e.changedTouches[0].clientX
        if (positionOfEndTouch - firstTouch <= -100) {
            if (!(autoQuestionChanger)) {
                goNextQuestionOrEndTheQuiz()
            }
        }
        else if (positionOfEndTouch - firstTouch >= 100) {
            goLastQuestion()
        }
    }
    
    return (
        <React.Fragment>

            <LoadingScreen loadState={loadState} />
        
            <Header
                colorOfHeader='header__white'
            />

            <Helmet>
                <title>{`کوییزلند | تست ${replaceFunction(decodeURI(quizTitle), '+', ' ')}`}</title>
                <meta name="description" content={`با ${questions.length} سوال، ببین چی در میای | ${quiz.title} ${quiz.subCategory} تست با موضوع`} />
                <meta name="keywords" content="کوییز, تست, کوییزلند" />
                <meta name="msapplication-TileImage" content={quizThumbnail} />
                <meta property="og:site_name" content="کوییزلند" />
                <meta property="og:title" content={quiz.title} />
                <meta property="og:description" content={`با ${questions.length} سوال، ببین چی در میای | ${quiz.title} ${quiz.subCategory} تست با موضوع`} />
                <meta property="og:image" content={quizThumbnail} />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:width" content="300" />
                <meta property="og:image:height" content="300" />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={currentUrl()} />

                <script type="application/ld+json">
                {`
                    {
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "${quiz.title}",
                        "image": [
                            "${quizThumbnail}",
                            "${quiz.background}"
                         ],
                        "datePublished": "${quiz.publish}",
                        "dateModified": "${quiz.publish}",
                        "author": {
                            "@type": "Person",
                            "name": "مصطفی تبریزیان",
                            "url": "https://www.quizzland.net/contact"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "کوییزلند",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://www.quizzland.net${logo}"
                            }
                        }
                    }
                `}
                </script>
            </Helmet>

            {quiz.title &&
                <StickyShareButtons
                    config={{
                        alignment: 'left',    // alignment of buttons (left, right)
                        color: 'social',      // set the color of buttons (social, white)
                        enabled: true,        // show/hide buttons (true, false)
                        font_size: 16,        // font size for the buttons
                        hide_desktop: false,  // hide buttons on desktop (true, false)
                        labels: 'counts',     // button labels (cta, counts, null)
                        language: 'en',       // which language to use (see LANGUAGES)
                        min_count: 10,         // hide react counts less than min_count (INTEGER)
                        networks: [           // which networks to include (see SHARING NETWORKS)
                            'whatsapp',
                            'telegram',
                            'twitter',
                            'sms',
                            'sharethis',
                        ],
                        padding: 12,          // padding within buttons (INTEGER)
                        radius: 15,            // the corner radius on each button (INTEGER)
                        show_total: true,     // show/hide the total share count (true, false)
                        show_mobile: true,    // show/hide the buttons on mobile (true, false)
                        show_toggle: false,    // show/hide the toggle buttons (true, false)
                        size: 48,             // the size of each button (INTEGER)
                        top: 450,             // offset in pixels from the top of the page
                        url: currentUrl()
                    }}
                />
            }

            <div className={`${quizEnded ? 'fadeIn' : 'fadeOut'}`}>
                <div className={'loadingScreen pos-fix flex flex-jc-c flex-ai-c'}></div>
                <div className='countingResult loadingScreen pos-fix flex flex-jc-c flex-ai-c'>
                    ___ در حال محاسبه نتیجه کوییز___
                </div>  
            </div>
            

            <div className='adverts adverts__left'>
                <div id='mediaad-Spcz'></div>
            </div>

            <div id='mediaad-Spcz'></div>

            <div className='SFXController pos-abs' onClick={() => {SFXController()}} >
                <button type="button">
                    <img src={SFXAllowed === 'true' ? speakerIconOn : speakerIconOff} alt="کوییزلند ‌| Quizzland" />
                </button>
            </div>

            <div className="quiz__head pos-rel tx-al-r" id="quiz__head">
                {
                    !(contentLoaded) &&
                    <div className='flex flex-jc-c flex-ai-c'>
                        <div className={`skeletonLoading skeletonLoading__quizTitle tx-al-c wrapper-sm`}></div>
                    </div>
                }
                
                <div className="tx-al-c">
                    <h1>{ quiz.title }</h1>
                </div>

                <div className="quiz__detail flex flex-jc-c flex-ai-c">
                    {
                        !(contentLoaded) &&
                        <div className={`flex`}>
                            <div className='skeletonLoading skeletonLoading__quizInfo tx-al-c'></div>
                            <div className='skeletonLoading skeletonLoading__quizInfo tx-al-c'></div>
                        </div>
                    }
                    {
                        contentLoaded &&
                        <React.Fragment>
                            <h5>تعداد سوال ها: {questions.length}</h5>
                            <h5>{ makeDatePublishFormatForDetailInHead(quiz.publish) }</h5>
                        </React.Fragment>
                    }
                </div>
                {
                    contentLoaded &&
                    <div onClick={() => {setAutoQuestionChanger(autoQuestionChanger ? false : true)}} className={`quiz__autoQuestionChangerSwitch pos-rel center flex flex-jc-c flex-ai-c`} title='با انتخاب گزینه، خودکار پس از 3.5 ثانیه به سوال بعدی منتقل می‌شوید'>
                        <h6>تغییر خودکار</h6>
                        <button className="quiz__autoQuestionChangerSwitch__btn btn">
                            <div className={`quiz__autoQuestionChangerSwitch__innerBtn ${autoQuestionChanger ? 'quiz__autoQuestionChangerSwitch__innerBtn__switched' : '' } pos-rel`}></div>
                        </button>
                    </div>
                }
                
            </div>

            { isItDesktop() &&
                <hr className='divider'></hr>
            }

            {
                contentLoaded &&
                <div className={`quiz__questionCounter pos-rel flex flex-jc-c flex-ai-c`}>
                    <div className="quiz__questionCounter__totalAnswered">{currentQuestionNumber}</div>
                    سوال شماره
                </div>
            }

            <div onTouchStart={touchScreenStart} onTouchEnd={touchScreenEnd} className={`quiz__questions pos-rel flex flex-jc-c tx-al-c`} tag="quiz">
                <div className={`quiz__hider flex pos-rel`}>
                    {
                        !(contentLoaded) &&
                        <div className={`skeletonLoading skeletonLoading__quizQuestion tx-al-c wrapper-sm`}></div>
                    }
                    
                    {
                        isSafari ? quizQuestionsForSafari() : quizQuestions()
                    }
                    
                    {
                        contentLoaded && isItDesktop() &&
                        <div className={`quiz__questionChanger__container pos-abs`}>
                            <button onClick={goNextQuestionOrEndTheQuiz} className={`quiz__questionChanger pos-abs quiz__questionChanger__next btn ${ableToGoNext ? 'fadeIn' : 'fadeOut'} `} aria-label='Next Question'></button>
                            <button onClick={goLastQuestion} className={`quiz__questionChanger pos-abs quiz__questionChanger__last btn`} aria-label='Next Question'></button>
                        </div>
                    }
                </div>
            </div>

            <div>
                <h7 className='quiz__tags__title flex flex-jc-c flex-ai-c beforeAfterDecor'>تگ های کوییز</h7>
                <ul className='quiz__tags flex flex-jc-c flex-ai-c'>
                    { showTheTagsIfNotNull() }
                </ul>
            </div>

            <div className='space-med'>
                <h7 className='quiz__tags__title flex flex-jc-c flex-ai-c beforeAfterDecor'>کوییز های مشابه</h7>

                {SkeletonLoading(contentLoaded)}
                
                <ul className="quizContainer flex wrapper-med">
                    {
                        suggestionQuizzes && <QuizPointyContainer quizzes={suggestionQuizzes} bgStyle='bg' />
                    }
                </ul>
            </div>
            
            <Link
                ref={result} className='noVis'
                to='/result_p/s'
            ></Link>

        </React.Fragment>
    );
}
 
export default Quiz;