import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import { notification } from 'antd';
import { Helmet } from "react-helmet";
import {StickyShareButtons} from 'sharethis-reactjs';
import { Switch, message } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import axios from 'axios'
import Header from '../components/header'
import AddView from '../components/addView';

import { log, replaceFunction, makeDatePublishFormatForQuizDetail, isItDesktop, isItMobile, isItIPad } from '../components/base'
import LoadingScreen from '../components/loadingScreen'
import QuizPointyContainer from '../components/quizPointyContainer'
import SkeletonLoading from '../components/skeletonLoading';

const logo = '/static/img/Q-small.png'

let quiz = 'null'

const Quiz = () => {
    const [questions, setQuestions] = useState([])
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
    const [currentMoveOfQuestions, setCurrentMoveOfQuestions] = useState(0)
    const [autoQuestionChanger, setAutoQuestionChanger] = useState(false)
    const [quizEnded, setQuizEnded] = useState(false)
    const [loadState, setLoadState] = useState()
    const [quizSlug, setQuizSlug] = useState(window.document.URL.split('/')[4])
    const [contentLoaded, setContentLoaded] = useState(false)
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()
    const [ableToGoNext, setAbleToGoNext] = useState(false)
    const [SFXAllowed, setSFXAllowed] = useState()
    const [SFXClick, setSFXClick] = useState(null)
    const [quiz, setQuiz] = useState(null)
    const [quizSlugReplacedWithHyphen, setQuizSlugReplacedWithHyphen] = useState()

    const result = useRef(null)

    useEffect(() => {
        grabData()
        setLoadState(true)
        SFXLocalStorage()
        setSFXClick(new Audio('/static/sound/SFXClick.mp3'))
    }, [quizSlug,])

    useEffect(() => {
        quizChangeDetector()
    })

    const SFXLocalStorage = () => {
        if (localStorage.getItem('SFXAllowed')) {
            setSFXAllowed(localStorage.getItem('SFXAllowed'))
        } else {
            localStorage.setItem('SFXAllowed', 'true')
            setSFXAllowed('true')
        }
    }

    const openNotification = () => {
        notification.open({
            message: 'راهنمایی برای تغییر سؤال',
            description:
            'برای تغییر سوال، صفحه را بکشید.',
            duration: 0,
            style: {
                'font-size': '25px',
                'font-weight': '600',
                'box-shadow': '0 0 20px #b52633',
                'direction': 'rtl',
                'padding-right': '4rem',
            },
            className: 'rounded-lg'
        });
    };
    
    const applyBackground = (background) => {
        document.querySelector('html').style = `background: url('${background}') center/cover no-repeat fixed !important`
    }

    const quizChangeDetector = () => {
        (function(history){
            let pushState = history.pushState;
            history.pushState = function() {
                pushState.apply(history, arguments);
            };

            const slug = replaceFunction(window.location.pathname.split('/')[2], '-', '+')
            setQuizSlug(slug)
            setQuizSlugReplacedWithHyphen(slug)
        })(window.history);
    }
    
    const grabData = async () => {
        quizSlugReplacedWithHyphen &&
        await axios.get(`/api/pointy_new/?slug__iexact=${quizSlugReplacedWithHyphen}&limit=1&public=true`).then((res) => res.data.results[0])
            .then(async (quizData) => {
                try {
                    AddView('pointy_new', quizData.id)
                    sendCategoryAsInterest(quizData.subCategory)
                    getSuggestionsQuiz(quizData.subCategory)
                    applyBackground(quizData.background)
                    setQuiz(quizData)

                    await axios.get(`/api/questions_pointy/?quizKey=${quizData.id}&public=true`)
                        .then((questionData) => {
                            setQuestions(questionData?.data)
                            setContentLoaded(true)
                        })
                }
                catch (e) {
                    log(e)
                    setTimeout(() => {
                        window.location.href = '/404'
                    }, 5000)
                }
            })
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
                if (document.querySelector('.quiz__container').style.transform == 'translate(0rem)' && !(isItDesktop())) {
                    openNotification()
                }
            }, 5000)
        }
    }

    const takeSelectedOptionValue = (userSelection) => {
        let userChose = userSelection.id
        const currentQuestionNumber = parseInt(userChose.split('-')[0])

        for (let i = 1; i <= 10; i++) {
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
            return <p className='quiz__question text-center bg-[#0000007c] backdrop-blur-xl rounded-2xl'> {question} </p>
        }
    }

    let questionCounterForId = 1
    const questionOptionsCheckBetweenStringOrImg = (question) => {
        questionCounterForId += 1
        if (question.option_1st) {
            return (
                <div className="flex justify-center">
                    <form className='quiz__options p-4 md:p-0 w-[100%] md:grid md:grid-cols-2 space-y-3 text-[5vw] md:text-[1.6vw] justify-center' action="">
                        {question.option_1st !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-1`} /> <label className={`quiz__options__textLabel text-[1.3rem] bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-1`} htmlFor={`${questionCounterForId}-1`}> {question.option_1st} </label> </>}
                        {question.option_2nd !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-2`} /> <label className={`quiz__options__textLabel text-[1.3rem] bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-2`} htmlFor={`${questionCounterForId}-2`}> {question.option_2nd} </label> </>}
                        {question.option_3rd !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-3`} /> <label className={`quiz__options__textLabel text-[1.3rem] bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-3`} htmlFor={`${questionCounterForId}-3`}> {question.option_3rd} </label> </>}
                        {question.option_4th !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-4`} /> <label className={`quiz__options__textLabel text-[1.3rem] bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-4`} htmlFor={`${questionCounterForId}-4`}> {question.option_4th} </label> </>}
                        {question.option_5th !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-5`} /> <label className={`quiz__options__textLabel text-[1.3rem] bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-5`} htmlFor={`${questionCounterForId}-5`}> {question.option_5th} </label> </>}
                        {question.option_6th !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-6`} /> <label className={`quiz__options__textLabel text-[1.3rem] bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-6`} htmlFor={`${questionCounterForId}-6`}> {question.option_6th} </label> </>}
                        {question.option_7th !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-7`} /> <label className={`quiz__options__textLabel text-[1.3rem] bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-7`} htmlFor={`${questionCounterForId}-7`}> {question.option_7th} </label> </>}
                        {question.option_8th !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-8`} /> <label className={`quiz__options__textLabel text-[1.3rem] bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-8`} htmlFor={`${questionCounterForId}-8`}> {question.option_8th} </label> </>}
                        {question.option_9th !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-9`} /> <label className={`quiz__options__textLabel text-[1.3rem] bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-9`} htmlFor={`${questionCounterForId}-9`}> {question.option_9th} </label> </>}
                        {question.option_10th !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-10`} /> <label className={`quiz__options__textLabel text-[1.3rem] bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-10`} htmlFor={`${questionCounterForId}-10`}> {question.option_10th} </label> </>}
                    </form>
                </div>
            )
        } else {
            return (
                <div className="flex justify-center">
                    <form className='relative grid justify-center grid-cols-2 pt-4 quiz_options md:flex md:space-x-3 flex-wrap' data={question.answer} action="">
                        {!(question.option_img_1st?.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-1`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-1`} htmlFor={`${questionCounterForId}-1`}> <LazyLoadImage src={question.option_img_1st} width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_2nd?.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-2`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-2`} htmlFor={`${questionCounterForId}-2`}> <LazyLoadImage src={question.option_img_2st} width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_3rd?.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-3`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-3`} htmlFor={`${questionCounterForId}-3`}> <LazyLoadImage src={question.option_img_3rd} width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_4th?.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-4`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-4`} htmlFor={`${questionCounterForId}-4`}> <LazyLoadImage src={question.option_img_4th} width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_5th?.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-5`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-5`} htmlFor={`${questionCounterForId}-5`}> <LazyLoadImage src={question.option_img_5th} width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_6th?.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-6`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-6`} htmlFor={`${questionCounterForId}-6`}> <LazyLoadImage src={question.option_img_6th} width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_7th?.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-7`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-7`} htmlFor={`${questionCounterForId}-7`}> <LazyLoadImage src={question.option_img_7th} width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_8th?.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-8`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-8`} htmlFor={`${questionCounterForId}-8`}> <LazyLoadImage src={question.option_img_8th} width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_9th?.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-9`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-9`} htmlFor={`${questionCounterForId}-9`}> <LazyLoadImage src={question.option_img_9th} width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_10th?.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-10`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-10`} htmlFor={`${questionCounterForId}-10`}> <LazyLoadImage src={question.option_img_10th} width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                    </form>
                </div>
            )
        }
    }

    const isSafari = typeof (window) !== 'undefined' && navigator.userAgent.indexOf("Chrome") != -1 === false && navigator.userAgent.indexOf("Chrome") != -1

    const quizQuestions = (browser) => {
        return (
            questions?.map(question => {
                return (
                    <div key={question.id}
                        style={
                            browser == 'safari' ?
                                { left: `${currentMoveOfQuestions}rem` }
                                :
                                { transform: `translate(${currentMoveOfQuestions}rem)`, WebkitTransform: `translate(${currentMoveOfQuestions}rem)` }
                        }
                        className={`
                            quiz__container relative mr-20 ml-2 md:ml-0 md:pt-3
                            p-[0.1rem] transition-all duration-1000 ease-in-out
                        `}
                    >

                        {/* <span className='questionId block right-[-2rem] top-2 z-10 absolute text-[3rem]'>
                            {questionCounterForId}
                        </span> */}

                        <div>
                            {questionShowIfNotNull(question.question)}

                            <div className='mt-3 w-[22rem] md:w-[29rem]'>
                                {!question.question_img?.includes('NotExist') &&
                                    <LazyLoadImage
                                        src={question?.question_img}
                                        width={1366}
                                        height={768}
                                        alt={question.title}
                                        className='object-cover object-top rounded-xl'
                                        title={question.title}
                                    />}
                            </div>
                        </div>

                        {questionOptionsCheckBetweenStringOrImg(question)}

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

    if (isItDesktop() || isItIPad()) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 34.2
    }
    else if (isItMobile()) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 27.7
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
        } else {
            message.warning('لطفا یک گزینه را انتخاب کنید');
        }
    }

    const goLastQuestion = () => {
        if (currentQuestionNumber !== 1) {
            minusOneToTotalAnsweredQuestions()
            setCurrentMoveOfQuestions(prev => prev + sumOfTheWidthMarginAndPaddingOfQuestionForSliding)

        } else {
            message.warning('شما سوال اول هستید');
        }
    }

    const showTheTagsIfNotNull = () => {
        const splittedTags = quiz.tags.split('،')
        return (
            splittedTags.map(tag => {
                return (
                    <li key={tag} className='px-3 py-1 text-sm rounded-lg'>
                        <h4>
                            <Link
                                to={`/search?q=${replaceFunction(tag, ' ', '+')}`}
                                rel='tag'
                            >
                                {tag}
                            </Link>
                        </h4>
                    </li>
                )
            })
        )
    }

    const getSuggestionsQuiz = async (subCategory) => {
        await axios.get(`/api/pointy_new/?subCategory__icontains=${subCategory && replaceFunction(subCategory, ' ', '+')}&limit=8&public=true`)
            .then((res) => {setSuggestionQuizzes(res.data.results)})
    }

    const SFXController = () => {
        const changeToThis = SFXAllowed === 'true' ? 'false' : 'true'
        setSFXAllowed(changeToThis)
        localStorage.setItem('SFXAllowed', changeToThis)
    }

    const currentUrl = () => {
        return `https://www.quizzland.net/test/${replaceFunction(quizSlug, ' ', '-')}`
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
        
            <Header/>

            <Helmet>
                <title>{`کوییزلند | تست ${quiz && replaceFunction(decodeURI(quiz.title), '+', ' ')}`}</title>
                <meta name="description" content={`با ${questions.length} سوال، ببین چی در میای | ${quiz?.title} ${quiz?.subCategory} تست با موضوع`} />
                <meta name="keywords" content="کوییز, تست, کوییزلند" />
                <meta name="msapplication-TileImage" content={quiz?.thumbnail} />
                <meta property="og:site_name" content="کوییزلند" />
                <meta property="og:title" content={quiz?.title} />
                <meta property="og:description" content={`با ${questions.length} سوال، ببین چی در میای | ${quiz?.title} ${quiz?.subCategory} تست با موضوع`} />
                <meta property="og:image" content={quiz?.thumbnail} />
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
                        "headline": "${quiz?.title}",
                        "image": [
                            "${quiz?.thumbnail}",
                            "${quiz?.background}"
                         ],
                        "datePublished": "${quiz?.publish}",
                        "dateModified": "${quiz?.publish}",
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

            {quiz?.title &&
                <StickyShareButtons
                    config={{
                        alignment: 'left',  
                        color: 'social',    
                        enabled: true,      
                        font_size: 16,      
                        hide_desktop: false,
                        labels: 'counts',   
                        language: 'en',     
                        min_count: 10,       
                        networks: [         
                            'whatsapp',
                            'telegram',
                            'twitter',
                            'sms',
                            'sharethis',
                        ],
                        padding: 9,        
                        radius: 15,          
                        show_total: true,   
                        show_mobile: true,  
                        show_toggle: false,  
                        size: 38,           
                        top: 450,           
                        url: currentUrl()
                    }}
                />
            }

            <div className={`
                fixed left-0 backdrop-blur-3xl backdrop-brightness-75
                top-0 w-screen h-screen z-20 ${quizEnded ? 'fadeIn' : 'fadeOut'}
                flex flex-col items-center justify-center
            `}>
                <div>
                    <div className='bg-red-800 w-10 h-10 rounded-full absolute animate-ping'></div>
                    <div className='bg-red-800 w-10 h-10 rounded-full'></div>
                </div>
                <div className='mt-5'>
                    <h2>
                        در حال محاسبه نتیجه کوییز
                    </h2>
                </div>
            </div>


            {/* <div className='adverts adverts__left'>

            </div> */}

            {/* <div className='absolute md:ml-10 ml-4 top-28' onClick={() => { SFXController() }} >
                <button type="button">
                    {SFXAllowed === 'true' ?
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /> </svg>
                        :
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /> </svg>
                    }
                </button>
            </div> */}

            <div className="relative text-right quiz__head p-4 backdrop-blur-2xl w-[21rem] md:w-[33rem] left-1/2 translate-x-[-50%] bg-[#0000001a] rounded-xl" id="quiz__head">
                {
                    !(contentLoaded) &&
                    <div className='flex justify-center items-center'>
                        <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonLoading skeletonLoading__quizTitle'></div>
                    </div>
                }

                <div className="text-center flex justify-center mb-4">
                    <h1 className='md:max-w-[21rem] max-w-[19rem]'>
                        {quiz?.title}
                    </h1>
                </div>

                <div className="flex justify-center quiz__detail items-center">
                    {
                        !(contentLoaded) &&
                        <div className='flex space-x-5'>
                            <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonLoading skeletonLoading__quizInfo'></div>
                            <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonLoading skeletonLoading__quizInfo'></div>
                        </div>
                    }
                    {
                        contentLoaded &&
                        <div className='flex space-x-6 text-lg'>
                            <h5>{makeDatePublishFormatForQuizDetail(quiz?.publish)}</h5>
                            <h5>تعداد سوال ها: {questions?.length}</h5>
                        </div>
                    }
                </div>

                {
                    contentLoaded &&
                    <div className='flex space-x-5 translate-x-[-3rem]'>
                        <div onClick={() => { setAutoQuestionChanger(autoQuestionChanger ? false : true) }} className={`quiz__autoQuestionChangerSwitch mt-5 hover:cursor-pointer relative center flex justify-center items-center`} title='با انتخاب گزینه، خودکار پس از 3.5 ثانیه به سوال بعدی منتقل می شوید'>
                            {/* <button className="quiz__autoQuestionChangerSwitch__btn btn">
                                <div className={`quiz__autoQuestionChangerSwitch__innerBtn ${autoQuestionChanger ? 'quiz__autoQuestionChangerSwitch__innerBtn__switched' : ''} relative`}></div>
                            </button> */}
                            <div className='mt-3'>
                                <Switch
                                    checkedChildren='خودکار'
                                    unCheckedChildren='دستی'
                                    className={`${autoQuestionChanger ? 'bg-red-800' : 'bg-zinc-500'}`}
                                    onChange={() => { setAutoQuestionChanger(autoQuestionChanger ? false : true) }}
                                    title='تغییر سوال: با انتخاب گزینه، در صورت خودکار بودن، پس از حداقل 1.5 حداکثر 5.5 ثانیه به سوال بعدی منتقل می شوید'
                                />
                            </div>
                        </div>
                        <div onClick={() => { SFXController() }} className={`mt-5 hover:cursor-pointer relative center items-center`} title='فرض صدا های پس از پاسخ به سوال'>
                            <div className='mt-3'>
                                <Switch
                                    checkedChildren='فرض صدا'
                                    uncheckedChildren='فرض صدا'
                                    className={`${localStorage.getItem('SFXAllowed') === 'true' ? 'bg-red-800' : 'bg-zinc-500'}`}
                                    onChange={() => {SFXController()}}
                                    title='فرض صدا های پس از پاسخ به سوال'
                                />
                            </div>
                        </div>
                    </div>
                }

            </div>

            {
                contentLoaded && isItDesktop() &&
                <div className={`
                    quiz__questionChanger__container relative
                    top-24
                `}>
                    <button
                        onClick={goNextQuestionOrEndTheQuiz}
                        aria-label='Next Question'
                        className={`
                            quiz__questionChanger absolute
                            quiz__questionChanger__next btn
                            ${autoQuestionChanger ? 'fadeOut' : 'fadeIn'}
                        `}
                    >

                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <polyline points="12 16 16 12 12 8" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>

                    </button>
                    <button
                        onClick={goLastQuestion}
                        aria-label='Next Question'
                        className={`
                            quiz__questionChanger absolute quiz__questionChanger__last
                            btn
                        `}
                    >
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <polyline points="12 16 16 12 12 8" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>
                    </button>
                </div>
            }

            {/* { isItDesktop() &&
                <hr className='divider'></hr>
            } */}

            {/* {
                contentLoaded &&
                <div className={`quiz__questionCounter relative flex justify-center items-center`}>
                    <div className="quiz__questionCounter__totalAnswered">{currentQuestionNumber}</div>
                    سوال شماره
                </div>
            } */}

            <div onTouchStart={touchScreenStart} onTouchEnd={touchScreenEnd} className={`quiz__questions h-full mb-4 relative flex justify-center text-center mt-12 md:mt-0`} tag="quiz">
                <div className={`quiz__hider mt-5 flex relative`}>
                    {
                        !(contentLoaded) &&
                        <div className='mt-5 overflow-hidden shadow-lg skeletonLoading skeletonLoading__quizQuestion shadow-zinc-800 rounded-xl'></div>
                    }

                    {
                        isSafari ? quizQuestions('safari') : quizQuestions('otherBrowser')
                    }

                </div>
            </div>

            <div>
                <h7 className='flex justify-center quiz__tags__title items-center beforeAfterDecor'>تگ های کوییز</h7>
                <ul className='flex flex-wrap justify-center my-5 space-x-3 space-y-2 space-x-reverse quiz__tags items-baseline'>
                    {quiz && showTheTagsIfNotNull()}
                </ul>
            </div>

            <div className='space-med'>
                <h7 className='flex justify-center quiz__tags__title items-center beforeAfterDecor'>کوییز های مشابه</h7>

                {SkeletonLoading(contentLoaded)}

                <ul className="flex flex-wrap align-baseline">
                    {
                        suggestionQuizzes && <QuizPointyContainer quizzes={suggestionQuizzes} bgStyle='bg' />
                    }
                </ul>
            </div>

            <Link
                to='/result_test'
                ref={result}
                className='noVis'
            >    
            </Link>

        </React.Fragment>
    );
}
 
export default Quiz;