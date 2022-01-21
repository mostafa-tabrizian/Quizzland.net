import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
// import {StickyShareButtons} from 'sharethis-reactjs';
import rateLimit from 'axios-rate-limit';

import { log, replaceFunction, isItDesktop, isItMobile, makeDatePublishFormatForQuizDetail } from '../../components/base'
// import LoadingScreen from '../../components/loadingScreen'
import QuizPointyContainer from '../../components/quizPointyContainer'
// import SkeletonLoading from '../../components/skeletonLoading'
import Layout from '../../components/layout'

const logo = '../images/Q-small.png'
const speakerIconOn = '/images/speakerOn.png'
const speakerIconOff = '/images/speakerOff.png'

let quiz = 'null'

const Quiz = () => {
    const router = useRouter()
    const { testTitle } = router.query
    
    const [questions, setQuestions] = useState(null)
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
    const [currentMoveOfQuestions, setCurrentMoveOfQuestions] = useState(0)
    const [autoQuestionChanger, setAutoQuestionChanger] = useState(false)
    const [quizEnded, setQuizEnded] = useState(false)
    const [loadState, setLoadState] = useState(null)
    const [contentLoaded, setContentLoaded] = useState(false)
    const [suggestionQuizzes, setSuggestionQuizzes] = useState(null)
    const [ableToGoNext, setAbleToGoNext] = useState(false)
    const [SFXAllowed, setSFXAllowed] = useState(null)
    const [showQuestionChangingHelper, setShowQuestionChangingHelper] = useState(false)
    const [SFXClick, setSFXClick] = useState(null)
    const [quiz, setQuiz] = useState(null)


    const result = useRef(null)
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const testTitleReplacedWithHyphen = () =>  {
        return replaceFunction(testTitle, '-', '+')
    }

    useEffect(() => {
        grabData()
        setLoadState(true)
        SFXLocalStorage()
        setSFXClick(new Audio('../sounds/SFXClick.mp3'))
    }, [testTitle, ])

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 8, perMilliseconds: 1000, maxRPS: 150 })

    const SFXLocalStorage = () => {
        if (localStorage.getItem('SFXAllowed')) {
            setSFXAllowed(localStorage.getItem('SFXAllowed'))
        } else {
            localStorage.setItem('SFXAllowed', 'true')
            setSFXAllowed('true')
        }
    }

    const applyBackground = (background) => {
        document.querySelector('html').style = `background: url('${background}') center/cover no-repeat fixed !important`
    }
    
    const grabData = () => {
        if (testTitle != undefined) {
            const grabQuiz = async () => {
                return await axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?title__iexact=${testTitleReplacedWithHyphen()}&limit=1`).then((res) => res.data.results[0])
            }
                
            const grabQuestions = async () => {
                return await axiosLimited.get(`${API_URL}/dbAPI/questions_pointy/?title__iexact=${testTitleReplacedWithHyphen()}`)
            }
            
            grabQuiz().then((quiz) => {
                try {
                    sendCategoryAsInterest(quiz.subCategory)
                    applyBackground(quiz.background)
                    setQuiz(quiz)
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
    }

    const sendCategoryAsInterest = (category) => {
        const interest = JSON.parse(localStorage.getItem('interest'))

        if (interest !== null) {
            if (category in interest['categoryWatchedCounter']) {
                const oldValue = interest['categoryWatchedCounter'][category]
                let interestNew = JSON.parse(localStorage.getItem('interest'))
                interestNew['categoryWatchedCounter'][category] = oldValue + 1
                localStorage.setItem('interest', JSON.stringify(interestNew))

            } else {
                let interestNew = JSON.parse(localStorage.getItem('interest'))
                interestNew['categoryWatchedCounter'][category] = 1
                localStorage.setItem('interest', JSON.stringify(interestNew))
            }
        } else {
            localStorage.setItem('interest', JSON.stringify({ categoryWatchedCounter: { [category]: 1 } }))
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

            setTimeout(() => {
                if (showQuestionChangingHelper !== 'never' && !(isItDesktop())) {
                    setShowQuestionChangingHelper(true)
                }
            }, 5000)
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

    let questionCounterForId = 0
    const questionOptionsCheckBetweenStringOrImg = (question) => {
        questionCounterForId += 1
        if (question.option_1st) {
            return (
                <div className="flex flex-jc-c">
                    <form className='quiz__options quiz__options__text' action="">
                        { question.option_1st !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-1`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${questionCounterForId}-1`} htmlFor={`${questionCounterForId}-1`}> { question.option_1st } </label> </> }
                        { question.option_2nd !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-2`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${questionCounterForId}-2`} htmlFor={`${questionCounterForId}-2`}> { question.option_2nd } </label> </> }
                        { question.option_3rd !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-3`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${questionCounterForId}-3`} htmlFor={`${questionCounterForId}-3`}> { question.option_3rd } </label> </> }
                        { question.option_4th !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-4`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${questionCounterForId}-4`} htmlFor={`${questionCounterForId}-4`}> { question.option_4th } </label> </> }
                        { question.option_5th !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-5`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${questionCounterForId}-5`} htmlFor={`${questionCounterForId}-5`}> { question.option_5th } </label> </> }
                        { question.option_6th !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-6`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${questionCounterForId}-6`} htmlFor={`${questionCounterForId}-6`}> { question.option_6th } </label> </> }
                        { question.option_7th !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-7`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${questionCounterForId}-7`} htmlFor={`${questionCounterForId}-7`}> { question.option_7th } </label> </> }
                        { question.option_8th !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-8`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${questionCounterForId}-8`} htmlFor={`${questionCounterForId}-8`}> { question.option_8th } </label> </> }
                        { question.option_9th !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-9`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${questionCounterForId}-9`} htmlFor={`${questionCounterForId}-9`}> { question.option_9th } </label> </> }
                        { question.option_10th !== ('') && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-10`} /> <label className={'quiz__options__textLabel'} id={`inputLabel ${questionCounterForId}-10`} htmlFor={`${questionCounterForId}-10`}> { question.option_10th } </label> </> }
                    </form>
                </div>
            )
        } else {
            return (
                <div className="flex flex-jc-c">
                    <form className='quiz__options quiz__options__img grid flex-jc-c pos-rel' data={question.answer} action="">
                        { !(question.option_img_1st.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-1`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${questionCounterForId}-1`} htmlFor={`${questionCounterForId}-1`}> <Image src={question.option_img_1st} blurDataURL={question.option_img_1st} placeholder='blur' width='512' height='288' alt={question.title} title={question.title} className="quiz__imgOption" /> </label> </> }
                        { !(question.option_img_2nd.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-2`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${questionCounterForId}-2`} htmlFor={`${questionCounterForId}-2`}> <Image src={question.option_img_2st} blurDataURL={question.option_img_2st} placeholder='blur' width='512' height='288' alt={question.title} title={question.title} className="quiz__imgOption" /> </label> </> }
                        { !(question.option_img_3rd.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-3`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${questionCounterForId}-3`} htmlFor={`${questionCounterForId}-3`}> <Image src={question.option_img_3st} blurDataURL={question.option_img_3st} placeholder='blur' width='512' height='288' alt={question.title} title={question.title} className="quiz__imgOption" /> </label> </> }
                        { !(question.option_img_4th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-4`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${questionCounterForId}-4`} htmlFor={`${questionCounterForId}-4`}> <Image src={question.option_img_4st} blurDataURL={question.option_img_4st} placeholder='blur' width='512' height='288' alt={question.title} title={question.title} className="quiz__imgOption" /> </label> </> }
                        { !(question.option_img_5th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-5`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${questionCounterForId}-5`} htmlFor={`${questionCounterForId}-5`}> <Image src={question.option_img_5st} blurDataURL={question.option_img_5st} placeholder='blur' width='512' height='288' alt={question.title} title={question.title} className="quiz__imgOption" /> </label> </> }
                        { !(question.option_img_6th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-6`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${questionCounterForId}-6`} htmlFor={`${questionCounterForId}-6`}> <Image src={question.option_img_6st} blurDataURL={question.option_img_6st} placeholder='blur' width='512' height='288' alt={question.title} title={question.title} className="quiz__imgOption" /> </label> </> }
                        { !(question.option_img_7th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-7`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${questionCounterForId}-7`} htmlFor={`${questionCounterForId}-7`}> <Image src={question.option_img_7st} blurDataURL={question.option_img_7st} placeholder='blur' width='512' height='288' alt={question.title} title={question.title} className="quiz__imgOption" /> </label> </> }
                        { !(question.option_img_8th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-8`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${questionCounterForId}-8`} htmlFor={`${questionCounterForId}-8`}> <Image src={question.option_img_8st} blurDataURL={question.option_img_8st} placeholder='blur' width='512' height='288' alt={question.title} title={question.title} className="quiz__imgOption" /> </label> </> }
                        { !(question.option_img_9th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-9`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${questionCounterForId}-9`} htmlFor={`${questionCounterForId}-9`}> <Image src={question.option_img_9st} blurDataURL={question.option_img_9st} placeholder='blur' width='512' height='288' alt={question.title} title={question.title} className="quiz__imgOption" /> </label> </> }
                        { !(question.option_img_10th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" id={`${questionCounterForId}-10`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${questionCounterForId}-10`} htmlFor={`${questionCounterForId}-10`}> <Image src={question.option_img_10st} blurDataURL={question.option_img_10st} placeholder='blur' width='512' height='288' alt={question.title} title={question.title} className="quiz__imgOption" /> </label> </> }
            </form>                                                                                                                                                                                                                                                                                             
                </div>
            )
        }
    }

    const isSafari = typeof(window) !== 'undefined' && navigator.userAgent.indexOf("Chrome")!=-1 === false && navigator.userAgent.indexOf("Chrome")!=-1

    const quizQuestions = () => {
        return (
            questions && questions.map(question => {
                return (
                    <div key={question.id} style={{transform: `translate(${currentMoveOfQuestions}rem)`, WebkitTransform: `translate(${currentMoveOfQuestions}rem)`}} className="quiz__container pos-rel darkGls">

                        { questionShowIfNotNull(question.question) }

                        { !question.question_img.includes('NotExist') && 
                            <Image
                                src={question.question_img}
                                width={29 * 16}
                                height={16 * 16}
                                alt={question.title}
                                className='quiz__imgQuestion'
                                title={question.title}
                                blurDataURL={question.question_img}
                                placeholder='blur'
                            />
                        }

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
                    <div key={question.id} style={{left: `${currentMoveOfQuestions}rem`}} className="quiz__container pos-rel darkGls">

                        { questionShowIfNotNull(question.question) }

                        { !question.question_img.includes('NotExist') &&
                            <Image
                                    src={question.question_img}
                                    width='625'
                                    height='352'
                                    className='quiz__imgQuestion'    
                                    alt={question.title}
                                    title={question.title}     
                                    blurDataURL={question.question_img}
                                    placeholder='blur' 
                            />
                        }

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
    if (typeof(window) !== 'undefined' && window.navigator.userAgent.includes('Windows') || typeof(window) !== 'undefined' && window.navigator.userAgent.includes('iPad')) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 48
    } 
    else if (typeof(window) !== 'undefined' && window.navigator.userAgent.includes('Mobile')) {
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
            setShowQuestionChangingHelper('never')
            // setAbleToGoNext(false)
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
        const splittedTags = quiz.tags.split('،')
        return (    
            splittedTags.map(tag => {
                return <li key={tag}><h2><Link href={`/search?s=r${replaceFunction(tag, ' ', '+')}`} ><a rel='tag'> {tag} </a></Link></h2></li>
            })
        )
    }

    const getSuggestionsQuiz = (subCategory) => {
        axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?subCategory__icontains=${replaceFunction(subCategory, ' ', '+')}&limit=8`)
            .then((res) => {setSuggestionQuizzes(res.data.results)})
    }

    const SFXController = () => {
        const changeToThis = SFXAllowed === 'true' ? 'false' : 'true'
        setSFXAllowed(changeToThis)
        localStorage.setItem('SFXAllowed', changeToThis)
    }

    const currentUrl = () => {
        return `https://www.quizzland.net/test/${replaceFunction(testTitle, ' ', '-')}`
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
        <>
            <Layout>

                {/* <LoadingScreen loadState={loadState} /> */}

                <Head>
                    <title>{`کوییزلند | تست ${replaceFunction(decodeURI(testTitle), '+', ' ')}`}</title>
                    <meta name="description" content={`با ${questions && questions.length} سوال، ببین چی در میای | ${quiz && quiz.title} ${quiz && quiz.subCategory} تست با موضوع`} />
                    <meta name="keywords" content="کوییز, تست, کوییزلند" />
                    <meta name="msapplication-TileImage" content={quiz && quiz && quiz.thumbnail} />
                    <meta property="og:site_name" content="کوییزلند" />
                    <meta property="og:title" content={quiz && quiz.title} />
                    <meta property="og:description" content={`با ${questions && questions.length} سوال، ببین چی در میای | ${quiz && quiz.title} ${quiz && quiz.subCategory} تست با موضوع`} />
                    <meta property="og:image" content={quiz && quiz && quiz.thumbnail} />
                    <meta property="og:image:type" content="image/jpeg" />
                    <meta property="og:image:width" content="300" />
                    <meta property="og:image:height" content="300" />
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content={testTitle && currentUrl()} />

                    <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "Article",
                            "headline": "${quiz && quiz.title}",
                            "image": [
                                "${quiz && quiz.thumbnail}",
                                "${quiz && quiz.background}"
                            ],
                            "datePublished": "${quiz && quiz.publish}",
                            "dateModified": "${quiz && quiz.publish}",
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
                </Head>

                {/* {quiz && quiz.title &&
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
                            padding: 9,          // padding within buttons (INTEGER)
                            radius: 15,            // the corner radius on each button (INTEGER)
                            show_total: true,     // show/hide the total share count (true, false)
                            show_mobile: true,    // show/hide the buttons on mobile (true, false)
                            show_toggle: false,    // show/hide the toggle buttons (true, false)
                            size: 38,             // the size of each button (INTEGER)
                            top: 450,             // offset in pixels from the top of the page
                            url: testTitle && currentUrl()
                        }}
                    />
                } */}

                <div className={`${quizEnded ? 'fadeIn' : 'fadeOut'}`}>
                    <div className={'loadingScreen pos-fix flex flex-jc-c flex-ai-c'}></div>
                    <div className='countingResult loadingScreen pos-fix flex flex-jc-c flex-ai-c'>
                        ___ در حال محاسبه نتیجه کوییز___
                    </div>  
                </div>
                

                <div className='adverts adverts__left'>

                </div>

                <div className='SFXController pos-abs' onClick={() => {SFXController()}} >
                    <button type="button">
                        <Image
                            src={SFXAllowed === 'true' ? speakerIconOn : speakerIconOff}
                            width='24'
                            height='24'
                            alt='کوییزلند | Quizzland'       
                        />
                    </button>
                </div>

                <div className="quiz__head pos-rel tx-al-r" id="quiz__head">
                    {
                        !(contentLoaded) &&
                        <div className='flex flex-jc-c flex-ai-c'>
                            <div className={`skeletonLoading skeletonLoading__testTitle tx-al-c wrapper-sm`}></div>
                        </div>
                    }
                    
                    <div className="tx-al-c">
                        <h1>{ quiz && quiz.title }</h1>
                    </div>

                    <div className="quiz__detail flex flex-jc-c flex-ai-c">
                        {
                            !(contentLoaded) &&
                            <div className={`flex`} style={{height: '8rem'}}>
                                <div className='skeletonLoading skeletonLoading__quizInfo tx-al-c'></div>
                                <div className='skeletonLoading skeletonLoading__quizInfo tx-al-c'></div>
                            </div>
                        }
                        {
                            contentLoaded &&
                            <>
                                <h5>تعداد سوال ها: {questions && questions.length}</h5>
                                <h5>{ makeDatePublishFormatForQuizDetail(quiz && quiz.publish) }</h5>
                            </>
                        }
                    </div>
                    {
                        contentLoaded &&
                        <div onClick={() => {setAutoQuestionChanger(autoQuestionChanger ? false : true)}} className={`quiz__autoQuestionChangerSwitch pos-rel center flex flex-jc-c flex-ai-c`} title='با انتخاب گزینه، خودکار پس از 3.5 ثانیه به سوال بعدی منتقل می شوید'>
                            <h6>تغییر خودکار</h6>
                            <button className="quiz__autoQuestionChangerSwitch__btn btn">
                                <div className={`quiz__autoQuestionChangerSwitch__innerBtn ${autoQuestionChanger ? 'quiz__autoQuestionChangerSwitch__innerBtn__switched' : '' } pos-rel`}></div>
                            </button>
                        </div>
                    }
                    
                </div>

                {/* { isItDesktop() &&
                    <hr className='divider'></hr>
                } */}

                {
                    contentLoaded &&
                    <div className={`quiz__questionCounter pos-rel flex flex-jc-c flex-ai-c`}>
                        <div className="quiz__questionCounter__totalAnswered">{currentQuestionNumber}</div>
                        سوال شماره
                    </div>
                }

                <div className={`tx-al-c ${showQuestionChangingHelper === true ? 'fadeIn' : 'fadeOut'}`}>
                    <h5>برای رفتن به سوال بعدی از راست به چپ بکشید!</h5>
                </div>

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
                        { quiz && showTheTagsIfNotNull() }
                    </ul>
                </div>

                <div className='space-med'>
                    <h7 className='quiz__tags__title flex flex-jc-c flex-ai-c beforeAfterDecor'>کوییز های مشابه</h7>

                    {/* {SkeletonLoading(contentLoaded)} */}
                    
                    <ul className="quizContainer flex wrapper-med">
                        {
                            suggestionQuizzes && <QuizPointyContainer quizzes={suggestionQuizzes} bgStyle='bg' />
                        }
                    </ul>
                </div>
                
                <Link href='/testResult'><a ref={result} className='noVis'></a></Link>

            </Layout>
        </>
    );
}
 
export default Quiz;