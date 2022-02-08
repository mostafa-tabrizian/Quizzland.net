import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
// import {StickyShareButtons} from 'sharethis-reactjs';
import rateLimit from 'axios-rate-limit';

import { log, replaceFunction, isItDesktop, isItMobile, isItIPad, makeDatePublishFormatForQuizDetail } from '../../components/base'
// import LoadingScreen from '../../components/loadingScreen'
import QuizPointyContainer from '../../components/quizPointyContainer'
import SkeletonLoading from '../../components/skeleton'
import Layout from '../../components/layout'

const logo = '../images/Q-small.png'

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

    const testTitleReplacedWithHyphen = () => {
        return replaceFunction(testTitle, '-', '+')
    }

    useEffect(() => {
        grabData()
        setLoadState(true)
        SFXLocalStorage()
        setSFXClick(new Audio('../sounds/SFXClick.mp3'))
    }, [testTitle,])

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
                try {

                    const stillFirstQuestion = document.querySelector('.quiz__container').style.transform.slice(-5, -3) == '0r'

                    if (!(isItDesktop()) && stillFirstQuestion) {
                        setShowQuestionChangingHelper(true)
                    } else {
                        setShowQuestionChangingHelper(false)
                    }
                } catch {log('error: helper')}
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
            return <p className='text-center quiz__question'> {question} </p>
        }
    }

    let questionCounterForId = 1
    const questionOptionsCheckBetweenStringOrImg = (question) => {
        questionCounterForId += 1
        if (question.option_1st) {
            return (
                <div className="flex justify-center w-[20rem] md:w-[30rem]">
                    <form className='quiz__options p-4 md:p-0 w-[100%] md:grid md:grid-cols-2 space-y-3 text-[5vw] md:text-[1.6vw] justify-center' action="">
                        {question.option_1st !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-1`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-1`} htmlFor={`${questionCounterForId}-1`}> {question.option_1st} </label> </>}
                        {question.option_2nd !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-2`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-2`} htmlFor={`${questionCounterForId}-2`}> {question.option_2nd} </label> </>}
                        {question.option_3rd !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-3`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-3`} htmlFor={`${questionCounterForId}-3`}> {question.option_3rd} </label> </>}
                        {question.option_4th !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-4`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-4`} htmlFor={`${questionCounterForId}-4`}> {question.option_4th} </label> </>}
                        {question.option_5th !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-5`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-5`} htmlFor={`${questionCounterForId}-5`}> {question.option_5th} </label> </>}
                        {question.option_6th !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-6`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-6`} htmlFor={`${questionCounterForId}-6`}> {question.option_6th} </label> </>}
                        {question.option_7th !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-7`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-7`} htmlFor={`${questionCounterForId}-7`}> {question.option_7th} </label> </>}
                        {question.option_8th !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-8`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-8`} htmlFor={`${questionCounterForId}-8`}> {question.option_8th} </label> </>}
                        {question.option_9th !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-9`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-9`} htmlFor={`${questionCounterForId}-9`}> {question.option_9th} </label> </>}
                        {question.option_10th !== ('') && <> <input onClick={selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${questionCounterForId}-10`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${questionCounterForId}-10`} htmlFor={`${questionCounterForId}-10`}> {question.option_10th} </label> </>}
                    </form>
                </div>
            )
        } else {
            return (
                <div className="flex justify-center">
                    <form className='relative grid justify-center quiz__options quiz__options__img' data={question.answer} action="">
                        {!(question.option_img_1st.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-1`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-1`} htmlFor={`${questionCounterForId}-1`}> <Image src={question.option_img_1st} blurDataURL={question.option_img_1st} placeholder='blur' width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_2nd.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-2`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-2`} htmlFor={`${questionCounterForId}-2`}> <Image src={question.option_img_2st} blurDataURL={question.option_img_2st} placeholder='blur' width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_3rd.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-3`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-3`} htmlFor={`${questionCounterForId}-3`}> <Image src={question.option_img_3st} blurDataURL={question.option_img_3st} placeholder='blur' width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_4th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-4`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-4`} htmlFor={`${questionCounterForId}-4`}> <Image src={question.option_img_4st} blurDataURL={question.option_img_4st} placeholder='blur' width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_5th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-5`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-5`} htmlFor={`${questionCounterForId}-5`}> <Image src={question.option_img_5st} blurDataURL={question.option_img_5st} placeholder='blur' width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_6th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-6`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-6`} htmlFor={`${questionCounterForId}-6`}> <Image src={question.option_img_6st} blurDataURL={question.option_img_6st} placeholder='blur' width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_7th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-7`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-7`} htmlFor={`${questionCounterForId}-7`}> <Image src={question.option_img_7st} blurDataURL={question.option_img_7st} placeholder='blur' width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_8th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-8`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-8`} htmlFor={`${questionCounterForId}-8`}> <Image src={question.option_img_8st} blurDataURL={question.option_img_8st} placeholder='blur' width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_9th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-9`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-9`} htmlFor={`${questionCounterForId}-9`}> <Image src={question.option_img_9st} blurDataURL={question.option_img_9st} placeholder='blur' width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                        {!(question.option_img_10th.includes('NotExist')) && <> <input onClick={selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${questionCounterForId}-10`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${questionCounterForId}-10`} htmlFor={`${questionCounterForId}-10`}> <Image src={question.option_img_10st} blurDataURL={question.option_img_10st} placeholder='blur' width='512' height='624' alt={question.title} title={question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                    </form>
                </div>
            )
        }
    }

    const isSafari = typeof (window) !== 'undefined' && navigator.userAgent.indexOf("Chrome") != -1 === false && navigator.userAgent.indexOf("Chrome") != -1

    const quizQuestions = (browser) => {
        return (
            questions && questions.map(question => {
                return (
                    <div key={question.id}
                        style={
                            browser == 'safari' ?
                                { left: `${currentMoveOfQuestions}rem` }
                                :
                                { transform: `translate(${currentMoveOfQuestions}rem)`, WebkitTransform: `translate(${currentMoveOfQuestions}rem)` }
                        }
                        className={`quiz__container relative md:pt-3`}
                    >

                        {/* <span className='questionId block right-[-2rem] top-2 z-10 absolute text-[3rem]'>
                            {questionCounterForId}
                        </span> */}

                        <div>
                            {questionShowIfNotNull(question.question)}

                            <div className='mt-3'>
                                {!question.question_img.includes('NotExist') &&
                                    <Image
                                        src={question.question_img}
                                        width='1366'
                                        height='768'
                                        alt={question.title}
                                        className='object-contain object-top rounded-xl'
                                        title={question.title}
                                        blurDataURL='/images/Q-512.png'
                                        placeholder='blur'
                                    />}
                            </div>
                        </div>

                        {questionOptionsCheckBetweenStringOrImg(question)}

                    </div>
                )
            })
        )
    }

    // const quizQuestionsForSafari = () => {
    //     return (
    //         questions.map(question => {
    //             return (
    //                 <div key={question.id} style={{left: `${currentMoveOfQuestions}rem`}} className={`quiz__container relative darkGls`}>

    //                     <span className='block right-2 top-[-.5rem] z-10 absolute text-[3rem] text-red-900'>
    //                         {questionCounterForId}
    //                     </span>

    //                     { questionShowIfNotNull(question.question) }

    //                     { !question.question_img.includes('NotExist') &&
    //                         <Image
    //                                 src={question.question_img}
    //                                 width='1366'
    //                                 height='768'
    //                                 className='object-contain object-top rounded-xl'
    //                                 alt={question.title}
    //                                 title={question.title}     
    //                                 blurDataURL='/images/Q-512.png'
    //                                 placeholder='blur' 
    //                         />
    //                     }

    //                     { questionOptionsCheckBetweenStringOrImg(question) }

    //                 </div>
    //             )
    //         })
    //     )
    // }

    const plusOneToTotalAnsweredQuestions = () => {
        setCurrentQuestionNumber(prev => prev + 1)
    }

    const minusOneToTotalAnsweredQuestions = () => {
        setCurrentQuestionNumber(prev => prev - 1)
    }

    let sumOfTheWidthMarginAndPaddingOfQuestionForSliding

    if (isItDesktop() || isItIPad()) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 46.2  // quiz__hider width - margin/padding around the quiz__container + .62
    }
    else if (isItMobile()) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 22.7 // desktop - 23.6
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
                        localStorage.setItem('resultQuiz', JSON.stringify(quiz))
                        localStorage.setItem('testResult', calculateThePoints())
                        result.current.click()
                    } catch {
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
                return (
                    <li key={tag} className='px-3 py-1 text-sm rounded-lg'>
                        <h2>
                            <Link href={`/search?q=${replaceFunction(tag, ' ', '+')}`} >
                                <a rel='tag'>
                                    {tag}
                                </a>
                            </Link>
                        </h2>
                    </li>
                )
            })
        )
    }

    const getSuggestionsQuiz = (subCategory) => {
        axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?subCategory__icontains=${replaceFunction(subCategory, ' ', '+')}&limit=8`)
            .then((res) => { setSuggestionQuizzes(res.data.results) })
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
                    <title>{testTitle && `کوییزلند | تست ${replaceFunction(decodeURI(testTitle), '+', ' ')}`}</title>
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
                    <div className={'loadingScreen fixed flex justify-center flex-ai-c'}></div>
                    <div className='fixed flex justify-center countingResult loadingScreen flex-ai-c'>
                        ___ در حال محاسبه نتیجه تست
                    </div>
                </div>


                <div className='adverts adverts__left'>

                </div>

                <div className='absolute z-10 ml-10 top-28' onClick={() => { SFXController() }} >
                    <button type="button">
                        {SFXAllowed === 'true' ?
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /> </svg>
                            :
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /> </svg>
                        }
                    </button>
                </div>

                <div className="relative text-right quiz__head" id="quiz__head">
                    {
                        !(contentLoaded) &&
                        <div className='flex justify-center flex-ai-c'>
                            <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonLoading skeletonLoading__quizTitle'></div>
                        </div>
                    }

                    <div className="text-center">
                        <h1>{quiz && quiz.title}</h1>
                    </div>

                    <div className="flex justify-center quiz__detail flex-ai-c">
                        {
                            !(contentLoaded) &&
                            <div className='flex space-x-5'>
                                <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonLoading skeletonLoading__quizInfo'></div>
                                <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonLoading skeletonLoading__quizInfo'></div>
                            </div>
                        }
                        {
                            contentLoaded &&
                            <>
                                <h5>تعداد سوال ها: {questions && questions.length}</h5>
                                <h5>{quiz && makeDatePublishFormatForQuizDetail(quiz.publish)}</h5>
                            </>
                        }
                    </div>

                    {
                        contentLoaded &&
                        <div onClick={() => { setAutoQuestionChanger(autoQuestionChanger ? false : true) }} className={`quiz__autoQuestionChangerSwitch relative center flex justify-center flex-ai-c`} title='با انتخاب گزینه، خودکار پس از 3.5 ثانیه به سوال بعدی منتقل می شوید'>
                            <h6>تغییر خودکار</h6>
                            <button className="quiz__autoQuestionChangerSwitch__btn btn">
                                <div className={`quiz__autoQuestionChangerSwitch__innerBtn ${autoQuestionChanger ? 'quiz__autoQuestionChangerSwitch__innerBtn__switched' : ''} relative`}></div>
                            </button>
                        </div>
                    }

                </div>

                {/* { isItDesktop() &&
                    <hr className='divider'></hr>
                } */}

                {/* {
                    contentLoaded &&
                    <div className={`quiz__questionCounter relative flex justify-center flex-ai-c`}>
                        <div className="quiz__questionCounter__totalAnswered">{currentQuestionNumber}</div>
                        سوال شماره
                    </div>
                } */}

                <div className={`text-center mt-4 ${showQuestionChangingHelper ? 'fadeIn' : 'fadeOut'}`}>
                    <h5>برای رفتن به سوال بعدی از راست به چپ بکشید!</h5>
                </div>

                <div onTouchStart={touchScreenStart} onTouchEnd={touchScreenEnd} className={`quiz__questions relative flex justify-center text-center`} tag="quiz">
                    <div className={`quiz__hider flex relative`}>
                        {
                            !(contentLoaded) &&
                            <div className='mt-5 overflow-hidden shadow-lg skeletonLoading skeletonLoading__quizQuestion shadow-zinc-800 rounded-xl'></div>
                        }

                        {
                            isSafari ? quizQuestions('safari') : quizQuestions('otherBrowser')
                        }

                        {
                            contentLoaded && isItDesktop() &&
                            <div className={`
                                quiz__questionChanger__container absolute
                                top-4 right-[15%]
                            `}>
                                <button
                                    onClick={goNextQuestionOrEndTheQuiz}
                                    aria-label='Next Question'
                                    className={`
                                        quiz__questionChanger quiz__questionChanger__next
                                        btn absolute
                                        ${ableToGoNext ? 'fadeIn' : 'fadeOut'}
                                `}>

                                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <polyline points="12 16 16 12 12 8" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>

                                </button>
                                <button
                                    onClick={goLastQuestion}
                                    aria-label='Next Question'
                                    className={`
                                        quiz__questionChanger absolute quiz__questionChanger__last
                                        btn right-[34rem]
                                    `}
                                >
                                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <polyline points="12 16 16 12 12 8" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>
                                </button>
                            </div>
                        }
                    </div>
                </div>

                <div>
                    <h7 className='flex justify-center quiz__tags__title flex-ai-c beforeAfterDecor'>تگ های کوییز</h7>
                    <ul className='flex flex-wrap justify-center mt-5 space-x-3 space-y-2 space-x-reverse quiz__tags'>
                        {quiz && showTheTagsIfNotNull()}
                    </ul>
                </div>

                <div className='space-med'>
                    <h7 className='flex justify-center quiz__tags__title flex-ai-c beforeAfterDecor'>کوییز های مشابه</h7>

                    {SkeletonLoading(contentLoaded)}

                    <ul className="container flex flex-wrap m-4 align-baseline quizContainer flex-ai-fe md:px-20 justify-right">
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