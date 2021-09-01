import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

import { log, replaceFunction } from './base'
import HotHeader from './hotHeader'
import LoadingScreen from './loadingScreen'
import QuizPointyContainer from './quizPointyContainer'

const logo = '/static/img/Q2.png'

let quiz = 'null'

const Quiz = (props) => {
    const [questions, setQuestions] = useState([])
    const [totalPoints, setTotalPoints] = useState(0)
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
    const [currentMoveOfQuestions, setCurrentMoveOfQuestions] = useState(0)
    const [autoQuestionChanger, setAutoQuestionChanger] = useState(false)
    const [quizEnded, setQuizEnded] = useState(false)
    const [loadState, setLoadState] = useState()
    const [quizTitle, setQuizTitle] = useState(window.document.URL.split('/')[4])
    const [contentLoaded, setContentLoaded] = useState(false)
    const [suggestionQuizzes, setSuggestionQuizzes] = useState()
    const [quizThumbnail, setQuizThumbnail] = useState()
    const [quizUrl, setQuizUrl] = useState(window.document.URL)

    const result = useRef(null)

    const quizTitleReplacedWithHyphen = replaceFunction(quizTitle, '-', '+')

    useEffect(() => {
        grabData()
        setLoadState(true)
    }, quizTitle)

    useEffect(() => {
        quizChangeDetector()
    })

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
            const quizDB = await axios.get(`/dbAPI/new_pointy_quiz/?title__iexact=${quizTitleReplacedWithHyphen}&limit=1`)
            quiz = quizDB.data.results[0]
            return quiz
        }

        const grabQuestions = async () => {
            return await axios.get(`/dbAPI/pointyQuestions/?title__iexact=${quizTitleReplacedWithHyphen}`)
        }
        
        grabQuiz().then((quiz) => {
            setQuizThumbnail(quiz.thumbnail)
            addView(quiz)
        })

        grabQuestions().then((question) => {
            setQuestions(question.data)
            getSuggestionsQuiz(question.data[0].subCategory)
        })

        setContentLoaded(true)
        setBackground()
    }
    
    const addView = async (quiz) => {
        await axios.patch(`/dbAPI/new_pointy_quiz/${quiz.id}/`, {views: quiz.views+1, monthly_views:quiz.monthly_views+1})
    }

    const makeDatePublishFormatForDetailInHead = (time) => {
        return replaceFunction(String(time).slice(0, 10), '-', '/')
    }

    const selectedOption = (props) => {
        takeSelectedOptionValue(props.target)

        if (autoQuestionChanger) {
            automaticallyGoNextQuestionOrEndTheQuiz()
        }
    }

    const takeSelectedOptionValue = (userSelection) => {
        let userChose = userSelection.id
        const questionNumber = parseInt(userChose.slice(0, 1))
        const optionsSelectedNumber = parseInt(userChose.slice(2, 3)) - 1

        document.getElementById(`inputLabel ${questionNumber}-1`).style.borderColor = '#f0f0f0'
        document.getElementById(`inputLabel ${questionNumber}-2`).style.borderColor = '#f0f0f0'
        if(document.getElementById(`inputLabel ${questionNumber}-3`)) {
            document.getElementById(`inputLabel ${questionNumber}-3`).style.borderColor = '#f0f0f0'
        }
        if(document.getElementById(`inputLabel ${questionNumber}-4`)) {
            document.getElementById(`inputLabel ${questionNumber}-4`).style.borderColor = '#f0f0f0'
        }

        document.getElementById(`inputLabel ${userChose}`).style.borderColor = 'green'
    }

    const automaticallyGoNextQuestionOrEndTheQuiz = () => {
        setTimeout(() => {
            goNextQuestionOrEndTheQuiz()
        }, 3500);
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
                    </form>
                </div>
            )
        } else {
            return (
                <div className="flex flex-jc-c">
                    <form className='quiz__options quiz__options__img grid flex-jc-c pos-rel' data={question.answer} action="">
                        { !(question.option_img_1st.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-1`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${question.id}-1`} htmlFor={`${question.id}-1`}> <img className="quiz__imgOption" src={question.option_1st_img} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { !(question.option_img_2nd.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-2`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${question.id}-2`} htmlFor={`${question.id}-2`}> <img className="quiz__imgOption" src={question.option_2nd_img} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { !(question.option_img_3rd.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-3`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${question.id}-3`} htmlFor={`${question.id}-3`}> <img className="quiz__imgOption" src={question.option_3rd_img} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { !(question.option_img_4th.includes('NotExist')) && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-4`} /> <label className={'quiz__options__imgLabel'} id={`inputLabel ${question.id}-4`} htmlFor={`${question.id}-4`}> <img className="quiz__imgOption" src={question.option_4th_img} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                    </form>
                </div>
            )
        }
    }

    const quizQuestions = () => {
        return (
            questions.map(question => {
                return (
                    <div style={{transform: `translate(${currentMoveOfQuestions}rem)`}} className="quiz__container pos-rel darkGls">

                        { questionShowIfNotNull(question.question) }

                        { !question.question_img.includes('NotExist') && <img className="quiz__imgQuestion" src={question.question_img} alt={question.title} loading='lazy' /> }
                    
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
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 46
    } 
    else if (window.navigator.userAgent.includes('Mobile')) {
        sumOfTheWidthMarginAndPaddingOfQuestionForSliding = 25.83
    }

    const calculateThePoints = () => {
        const allOptions = document.querySelectorAll('input[type=radio]')
        const optionPoints = ['option_point_1st', 'option_point_2nd', 'option_point_3rd', 'option_point_4th']
        let totalPoints = 0

        for (let i = 0; i < allOptions.length; i++) {
            const question = allOptions[i].getAttribute('id')
            const questionNumber = question.slice(0, 1)
            const OptionSelected = parseInt(question.slice(2, 3)) - 1

            if (allOptions[i].checked) {
                const pointOfOptions = questions[questionNumber - 1][optionPoints[OptionSelected]]
                totalPoints += pointOfOptions
            }
        }

        return setTotalPoints(totalPoints)
    }

    const goNextQuestionOrEndTheQuiz = () => {
        if (currentQuestionNumber !== questions.length) {
            plusOneToTotalAnsweredQuestions()
            setCurrentMoveOfQuestions(prev => prev - sumOfTheWidthMarginAndPaddingOfQuestionForSliding)

        } else {
            setQuizEnded(true)
            calculateThePoints()

            setTimeout(() => {
                try {
                    result.current.click()
                } catch{}
            }, 3500)
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
                    tag = replaceFunction(tag, '-', ' ')
                    return <li><h2><Link to={`/search?s=${tag}`} >{tag}</Link></h2></li>
                })
            )
        }
    }

    const isItDesktop = () => {
        return window.navigator.userAgent.includes('Windows')
    }

    const getSuggestionsQuiz = (subCategory) => {
        axios.get(`/dbAPI/new_pointy_quiz/?subCategory__icontains=${replaceFunction(subCategory, ' ', '+')}&limit=8`)
            .then((res) => {setSuggestionQuizzes(res.data.results)})
    }

    return (
        <React.Fragment>
            <meta itemscope itemprop="mainEntityOfPage"  itemType="https://schema.org/WebPage" itemid={`${quizUrl}`} />

            <div itemprop="image" itemscope itemtype="https://schema.org/ImageObject" style={{display: 'none'}}>
                <img src={`${quizThumbnail}`} />
                <meta itemprop="url" content={`${quizThumbnail}`} />
                <meta itemprop="width" content="800" />
                <meta itemprop="height" content="800" />
            </div>

            <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization" style={{display: 'none'}}>
                <div itemprop="logo" itemscope itemtype="https://schema.org/ImageObject">
                    <img src={`${logo}`} />
                    <meta itemprop="url" content={`${logo}`} />
                    <meta itemprop="width" content="600" />
                    <meta itemprop="height" content="60" />
                </div>
                <meta itemprop="name" content="Quizzland | کوییزلند" />
            </div>

            <meta itemprop="datePublished" content={`${quiz.publish}`}/>

            <div className={`${quizEnded ? 'fadeIn' : 'fadeOut'}`}>
                <div className={'loadingScreen pos-fix flex flex-jc-c flex-ai-c'}></div>
                <div className='countingResult loadingScreen pos-fix flex flex-jc-c flex-ai-c'>
                    ___ در حال محاسبه نتیجه کوییز___
                </div>  
            </div>
            
            <LoadingScreen loadState={loadState} />

            <HotHeader
                colorOfHeader='header__white'
                title={`کوییزلند | ${replaceFunction(decodeURI(quizTitle), '+', ' ')}`}
            />

            <div className='adverts adverts__left'>
                <div id='mediaad-Spcz'></div>
            </div>

            <div id='mediaad-Spcz'></div>

            <div className="quiz__head pos-rel tx-al-r" id="quiz__head">
                <div className='flex flex-jc-c flex-ai-c'>
                    <div className={`skeletonLoading skeletonLoading__quizTitle tx-al-c wrapper-sm ${contentLoaded && 'noVis'}`}></div>
                </div>
                
                <div className="tx-al-c">
                    <h1 itemprop="title">{ quiz.title }</h1>
                </div>

                <div className="quiz__detail flex flex-jc-c flex-ai-c">
                    <div className={`flex ${contentLoaded && 'noVis'}`}>
                        <div className='skeletonLoading skeletonLoading__quizInfo tx-al-c'></div>
                        <div className='skeletonLoading skeletonLoading__quizInfo tx-al-c'></div>
                    </div>

                    <h5 className={`${!(contentLoaded) && 'noVis'}`}>تعداد سوال ها: {questions.length}</h5>
                    <h5 className={`${!(contentLoaded) && 'noVis'}`}>{ makeDatePublishFormatForDetailInHead(quiz.publish) }</h5>
                </div>
                
                <div className={`quiz__autoQuestionChangerSwitch pos-rel center flex flex-jc-c flex-ai-c ${!(contentLoaded) && 'noVis'} `} title='با انتخاب گزینه، خودکار پس از 3.5 ثانیه به سوال بعدی منتقل می‌شوید'>
                    <h6>تغییر خودکار</h6>
                    <button onClick={() => {setAutoQuestionChanger(autoQuestionChanger ? false : true)}} className="quiz__autoQuestionChangerSwitch__btn btn">
                        <div className={`quiz__autoQuestionChangerSwitch__innerBtn ${autoQuestionChanger && 'quiz__autoQuestionChangerSwitch__innerBtn__switched'} pos-rel`}></div>
                    </button>
                </div> 

                { !(isItDesktop()) &&
                    <div className={` quiz__questionChanger__container pos-rel center ${!(contentLoaded) && 'noVis'} `}>
                        <button onClick={goNextQuestionOrEndTheQuiz} className={`quiz__questionChanger pos-abs quiz__questionChanger__next btn ${autoQuestionChanger ? 'fadeOut' : 'fadeIn'}`} aria-label='Next Question'></button>
                        <button onClick={goLastQuestion} className={`quiz__questionChanger pos-abs quiz__questionChanger__last btn ${autoQuestionChanger ? 'fadeOut' : 'fadeIn'}`} aria-label='Next Question'></button>
                    </div>
                }
                
            </div>

            { isItDesktop() &&
                <hr className='divider'></hr>
            }

            <div className={`quiz__questionCounter pos-rel flex flex-jc-c flex-ai-c ${!(contentLoaded) && 'noVis'} `}>
                <div className="quiz__questionCounter__totalAnswered">{currentQuestionNumber}</div>
                سوال شماره
            </div>

            <div className={`quiz__questions pos-rel flex flex-jc-c tx-al-c`} tag="quiz">
                <div className={`quiz__hider flex pos-rel`}>
                    <div className={`skeletonLoading skeletonLoading__quizQuestion tx-al-c wrapper-sm ${contentLoaded && 'noVis'}`}></div>
                    { quizQuestions() }
                    
                    { isItDesktop() &&
                        <div className={`quiz__questionChanger__container pos-abs ${!(contentLoaded) && 'noVis'} `}>
                            <button onClick={goNextQuestionOrEndTheQuiz} className={`quiz__questionChanger pos-abs quiz__questionChanger__next btn ${autoQuestionChanger ? 'fadeOut' : 'fadeIn'}`} aria-label='Next Question'></button>
                            <button onClick={goLastQuestion} className={`quiz__questionChanger pos-abs quiz__questionChanger__last btn ${autoQuestionChanger ? 'fadeOut' : 'fadeIn'}`} aria-label='Next Question'></button>
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
                <ul className="quizContainer flex wrapper-med">
                    {
                        suggestionQuizzes && <QuizPointyContainer quizzes={suggestionQuizzes} bgStyle='bg' />
                    }
                </ul>
            </div>
            
            <Link
                ref={result} className='noVis'
                to={{ pathname: '/result_p', state: {quiz: quiz,  totalPoints: totalPoints} }}
            ></Link>

        </React.Fragment>
    );
}
 
export default Quiz;