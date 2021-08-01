import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

import { log, replaceFunction } from './base'
import HotHeader from './hotHeader'
import LoadingScreen from './loadingScreen'

let quiz = 'null'

const Quiz = (props) => {
    const [questions, setQuestions] = useState([])
    const [correctAnswersCounter, setCorrectAnswersCounter] = useState(0)
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
    const [currentMoveOfQuestions, setCurrentMoveOfQuestions] = useState(-17)
    const [correctAnswerOption, setCorrectAnswerOption] = useState(0)
    const [wrongAnswerOption, setWrongAnswerOption] = useState(0)
    const [scaleAnimation, setScaleAnimation] = useState(false)
    const [autoQuestionChanger, setAutoQuestionChanger] = useState(false)
    const [showImGifTextAnswer, setShowImGifTextAnswer] = useState(false)
    const [showBottomQuestionChanger, setShowBottomQuestionChanger] = useState(false)
    const [ableToSelectOption, setAbleToSelectOption] = useState(true)
    const [quizEnded, setQuizEnded] = useState(false)
    const [loadState, setLoadState] = useState()
    const [quizTitle, setQuizTitle] = useState(window.document.URL.split('/')[4])

    const result = useRef(null)

    const quizTitleReplacedWithHyphen = replaceFunction(quizTitle, '-', '+')

    useEffect(() => {
        grabData()
        setLoadState(true)
    }, [quizTitle])

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
        document.getElementById('html').style=`background: url('${quiz.background}') center center no-repeat fixed !important;`
        document.getElementById('html').style='background-size: 100vw 100vh;'
    } ;
    
    const grabData = async () => {
        const quizDB = await axios.get(`/dbQuizzland$M19931506/new_quiz/?title__iexact=${quizTitleReplacedWithHyphen}&limit=1`)
        quiz = quizDB.data.results[0]

        
        const questions = await axios.get(`/dbQuizzland$M19931506/questions/?title__iexact=${quizTitleReplacedWithHyphen}`)
        setQuestions(questions.data)
        
        setBackground()
        addView(quizDB.data.results[0])
    }
    
    const addView = async (quiz) => {
        await axios.patch(`/dbQuizzland$M19931506/new_quiz/${quiz.id}/`, {views: quiz.views+1, monthly_views:quiz.monthly_views+1})
    }

    const makeTheDatePublishReadyToShow = (time) => {
        return replaceFunction(String(time).slice(0, 10), '-', '/')
    }

    const checkTheSelectedOption = (userSelection) => {

        let userChose = parseInt(userSelection.id.slice(-1))
        let correctAnswer = parseInt(questions[currentQuestionNumber - 1].answer)

        setCorrectAnswerOption(correctAnswer)
        
        if (userChose !== correctAnswer) {
            setWrongAnswerOption(parseInt(userChose))
        } else {
            setCorrectAnswersCounter(prev => prev + 1)
        }

    }

    const scaleAnimationAfterChoosingAnswer = () => {
        setScaleAnimation(true)

        setTimeout(() => {
            setScaleAnimation(false)
        }, 150)
    }

    const automaticallyGoNextQuestionOrEndTheQuiz = () => {
        setTimeout(() => {
            goNextQuestionOrEndTheQuiz()
        }, 5000);
        
    }

    const disableSelectingOption = () => {
        setAbleToSelectOption(false)
    }

    const selectedOption = (props) => {
        setTimeout(() => {
            document.getElementById('quiz__answerDetail').scrollIntoView(false)
        }, 170)

        disableSelectingOption()
        checkTheSelectedOption(props.target)
        scaleAnimationAfterChoosingAnswer()
        setShowImGifTextAnswer(true)
        setShowBottomQuestionChanger(true)
        if (autoQuestionChanger) {
            automaticallyGoNextQuestionOrEndTheQuiz()
        }
    }

    const questionsOptions = (question) => {
        if (question.option_1) {
            return (
                <div className="flex flex-jc-c">
                    <form className='quiz__options quiz__options__text' action="">
                        { question.option_1 !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-1`} /> <label className={`quiz__options__textLabel ${correctAnswerOption === 1 && 'quiz__correctAnswer'} ${wrongAnswerOption === 1 && 'quiz__wrongAnswer'}`} id={`${question.id}-1`} htmlFor={`${question.id}-1`}> { question.option_1 } </label> </React.Fragment> }
                        { question.option_2 !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-2`} /> <label className={`quiz__options__textLabel ${correctAnswerOption === 2 && 'quiz__correctAnswer'} ${wrongAnswerOption === 2 && 'quiz__wrongAnswer'}`} id={`${question.id}-2`} htmlFor={`${question.id}-2`}> { question.option_2 } </label> </React.Fragment> }
                        { question.option_3 !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-3`} /> <label className={`quiz__options__textLabel ${correctAnswerOption === 3 && 'quiz__correctAnswer'} ${wrongAnswerOption === 3 && 'quiz__wrongAnswer'}`} id={`${question.id}-3`} htmlFor={`${question.id}-3`}> { question.option_3 } </label> </React.Fragment> }
                        { question.option_4 !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-4`} /> <label className={`quiz__options__textLabel ${correctAnswerOption === 4 && 'quiz__correctAnswer'} ${wrongAnswerOption === 4 && 'quiz__wrongAnswer'}`} id={`${question.id}-4`} htmlFor={`${question.id}-4`}> { question.option_4 } </label> </React.Fragment> }
                    </form>
                </div>
            )
        } else {
            return (
                <div className="flex flex-jc-c">
                    <form className='quiz__options quiz__options__img grid flex-jc-c pos-rel' data={question.answer} action="">
                        { question.option_1_img !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-1`} /> <label className={`quiz__options__imgLabel ${correctAnswerOption === 1 && 'quiz__correctAnswer'} ${wrongAnswerOption === 1 && 'quiz__wrongAnswer'}`} id={`${question.id}-1`} htmlFor={`${question.id}-1`}> <img className="quiz__imgOption" src={question.option_1_img.url} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { question.option_2_img !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-2`} /> <label className={`quiz__options__imgLabel ${correctAnswerOption === 2 && 'quiz__correctAnswer'} ${wrongAnswerOption === 2 && 'quiz__wrongAnswer'}`} id={`${question.id}-2`} htmlFor={`${question.id}-2`}> <img className="quiz__imgOption" src={question.option_2_img.url} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { question.option_3_img !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-3`} /> <label className={`quiz__options__imgLabel ${correctAnswerOption === 3 && 'quiz__correctAnswer'} ${wrongAnswerOption === 3 && 'quiz__wrongAnswer'}`} id={`${question.id}-3`} htmlFor={`${question.id}-3`}> <img className="quiz__imgOption" src={question.option_3_img.url} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                        { question.option_4_img !== ('') && <React.Fragment> <input onClick={selectedOption} type="radio" name="answer" id={`${question.id}-4`} /> <label className={`quiz__options__imgLabel ${correctAnswerOption === 4 && 'quiz__correctAnswer'} ${wrongAnswerOption === 4 && 'quiz__wrongAnswer'}`} id={`${question.id}-4`} htmlFor={`${question.id}-4`}> <img className="quiz__imgOption" src={question.option_4_img.url} alt={question.title} loading='lazy' /> </label> </React.Fragment> }
                    </form>
                </div>
            )
        }
    }

    const answerText = (question) => {
        if (question.answer_text) {
            return (
                <div
                    dangerouslySetInnerHTML={{
                        __html: question.answer_text
                    }}>
                </div>
            )
        }
    }

    const answerImGif = (question) => {
        if (question.answer_imGif) {
            return <img src={question.answer_imGif} alt="quiz-question-WebP" />
        }
    }

    const quizQuestions = () => {
        return (
            questions.map(question => {
                return (
                    <div style={{transform: `translate(${currentMoveOfQuestions}rem)`}} className="quiz__container pos-rel darkGls">
                        { !question.question_img.includes('NotExist') && <img className="quiz__imgQuestion" src={question.question_img} alt={question.title} loading='lazy' /> }
                        <p className='quiz__question tx-al-c'> { question.question } </p>
                        { questionsOptions(question) }
                        
                        <div className={`quiz__answerText tx-al-r ${!showImGifTextAnswer && 'noVis'}`}>
                            { answerText(question) }
                        </div>
    
                        <div className={`quiz__answerImGif ${!showImGifTextAnswer && 'noVis'}`}>
                            { answerImGif(question) }
                        </div>
                    </div>
                )
            })
        )
    }

    const plusOneToTotalAnsweredQuestions = () => {
        setCurrentQuestionNumber(prev => prev + 1)
    }

    const restartTheStateOfQuestion = () => {
        setShowImGifTextAnswer(false)
        setShowBottomQuestionChanger(false)
        setCorrectAnswerOption(0)
        setWrongAnswerOption(0)
        setAbleToSelectOption(true)
    }

    const goNextQuestionOrEndTheQuiz = () => {
        if (currentQuestionNumber !== questions.length) {
            restartTheStateOfQuestion()
            plusOneToTotalAnsweredQuestions()
            setCurrentMoveOfQuestions(prev => prev - 67)
            document.getElementById('quiz__head').scrollIntoView()

        } else {
            setQuizEnded(true)
            setTimeout(() => {
                try {
                    result.current.click()
                } catch{}
            }, 3500)
            
        }
    }

    const shouldShowTheBottomQuestionChanger = () => {
        if (showBottomQuestionChanger) {
            if (autoQuestionChanger) {
                return 'fadeOut'
            } else {
                return 'fadeIn'
            }
        } else {
            return 'fadeOut'
        }
    }

    return (
        <React.Fragment>

            <div className={`${quizEnded ? 'fadeIn' : 'fadeOut'}`}>
                <div className={'loadingScreen pos-fix flex flex-jc-c flex-ai-c'}></div>
                <div className='countingResult loadingScreen pos-fix flex flex-jc-c flex-ai-c'>
                    ___ در حال محاسبه نتیجه کوئیز___
                </div>  
            </div>
            
            <LoadingScreen loadState={loadState} />

            <HotHeader
                colorOfHeader='header__white'
                title={`کوئيزلند | ${quiz.title}`}
            />

            <div className="quiz__head pos-rel tx-al-c" id="quiz__head">
                <h1 className="tx-al-c wrapper-sm">{ quiz.title }</h1>
                <div className="flex flex-jc-c flex-ai-c">
                    <h5>تعداد سوال ها: {questions.length}</h5>
                    <h5>{ makeTheDatePublishReadyToShow(quiz.publish) }</h5>
                </div>
                
                <div className='quiz__autoQuestionChangerSwitch pos-rel center flex flex-jc-c flex-ai-c' title='با انتخاب گزینه، پس از ۵ ثانیه به سوال بعدی میرود'>
                    <h5>تغییر خودکار</h5>
                    <button onClick={() => {setAutoQuestionChanger(autoQuestionChanger ? false : true)}} className="quiz__autoQuestionChangerSwitch__btn btn">
                        <div className={`quiz__autoQuestionChangerSwitch__innerBtn ${autoQuestionChanger && 'quiz__autoQuestionChangerSwitch__innerBtn__switched'} pos-rel`}></div>
                    </button>
                </div>

                <div className="quiz__questionChanger__container pos-rel center">
                    <button onClick={goNextQuestionOrEndTheQuiz} className={`quiz__questionChanger pos-abs quiz__questionChanger__next btn ${autoQuestionChanger ? 'fadeOut' : 'fadeIn'}`} aria-label='Next Question'></button>
                </div>
            </div>

            <div className="quiz__questionCounter pos-rel flex flex-jc-c flex-ai-c">
                <div className="quiz__questionCounter__totalAnswered">{currentQuestionNumber}</div>
                سوال شماره
            </div>

            <div className={`quiz__questions ${!ableToSelectOption && 'pointerOff'} pos-rel flex flex-jc-c tx-al-c`} tag="quiz">
                <div className={`quiz__hider flex pos-rel ${scaleAnimation && 'quiz__options__scaleUp'}`}>
                    { quizQuestions() }
                </div>

                <div className='quiz__bottomQuestionChanger__container pos-abs'  id="quiz__answerDetail">
                    <button onClick={goNextQuestionOrEndTheQuiz} className={`quiz__bottomQuestionChanger btn ${shouldShowTheBottomQuestionChanger()}` } aria-label="Next Question"></button>
                </div>
            </div>
            
            <Link
                ref={result} className='noVis'
                to={{ pathname: '/result', state: {quiz: quiz, questions: questions, correctAnswersCounter: correctAnswersCounter} }}
            ></Link>

        </React.Fragment>
    );
}
 
export default Quiz;