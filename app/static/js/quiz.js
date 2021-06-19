encodedNumbers = {
    1: 'b25l',
    2: 'dHdv',
    3: 'dGhyZWU=',
    4: 'Zm91cg==',
    'b25l': 1,
    'dHdv': 2,
    'dGhyZWU=': 3,
    'Zm91cg==': 4,
}

if (quiz__questions) {
    let typeOfQuiz = quiz__questions.getAttribute('tag')
    localStorage.setItem('typeOfQuiz', typeOfQuiz)
}

const whatIsTypeOfQuiz = () => {
    const typeOfQuiz = localStorage.getItem('typeOfQuiz')
    return typeOfQuiz
}

if (quiz__container__eachOne) {
    typeOfQuiz = whatIsTypeOfQuiz()
    if (typeOfQuiz == 'quiz') {
        quiz__container__eachOne.forEach(each => {
            const answerData = each.getAttribute('data')
            each[answerData - 1].value = 'Y29ycmVjdA=='
            encodedAnswer = (encodedNumbers[answerData])
            each.setAttribute('data', encodedAnswer)
        })
        
        let correct = 0
        let wrong = 0
    
        const scoreDATA = localStorage.getItem('score')
        const correctAnswerCounterDATA = localStorage.getItem('correctAnswer')
        const wrongAnswerCounterDATA = localStorage.getItem('wrongAnswer')

        const removeResultImg20 = () => {document.querySelector('.result__img20').remove()}
        const removeResultImg40 = () => {document.querySelector('.result__img40').remove()}
        const removeResultImg60 = () => {document.querySelector('.result__img60').remove()}
        const removeResultImg80 = () => {document.querySelector('.result__img80').remove()}
        const removeResultImg100 = () => {document.querySelector('.result__img100').remove()}

        if (result__detail__correctTime) {
            result__detail__correctTime.innerHTML = correctAnswerCounterDATA
            result__detail__wrongTime.innerHTML = wrongAnswerCounterDATA
            
            if (scoreDATA > 80){
                result__score.innerHTML = (`😎 ${scoreDATA}%`)
                result__subtitle.innerHTML = (`! تو یک ${ fanName } واقعی هستی <br/> 😎 وقتشه خودت رو به بقیه نشون بدی`)
                removeResultImg20(), removeResultImg40(), removeResultImg60(), removeResultImg80()
            }
                
                else if (scoreDATA > 60){
                result__score.innerHTML = (`😀 ${scoreDATA}%`)
                result__subtitle.innerHTML = ('عالیه، فقط یکم با یه فن واقعی بودن فاصله داری')
                removeResultImg20(), removeResultImg40(), removeResultImg60(), removeResultImg100()
            }
            else if (scoreDATA > 40){
                result__score.innerHTML = (`🙂 ${scoreDATA}%`)
                result__subtitle.innerHTML = ('بد نیست ولی میتونست بهتر هم باشه')
                removeResultImg20(), removeResultImg40(), removeResultImg80(), removeResultImg100()
            }
            else if (scoreDATA > 20){
                result__score.innerHTML = (`😭 ${scoreDATA}%`)
                result__subtitle.innerHTML = ('بیشتر تلاش کن. میتونی انجامش بدی')
                removeResultImg20(), removeResultImg60(), removeResultImg80(), removeResultImg100()
            }
            else if (scoreDATA >= 0){
                result__score.innerHTML = (`🙄 ${scoreDATA}%`)
                result__subtitle.innerHTML = (' .فکر کنم کوئیز رو اشتباهی انتخاب کردی <br/>😅 میتونی سریع کوئیز دیگه ای انتخاب کنی تا کسی نیومده ')
                removeResultImg40(), removeResultImg60(), removeResultImg80(), removeResultImg100()
            }
        } else { log('no result page') } 
    }
} else { log('no quiz.js') }

// ----------------------------------------------

const ifOptionEmptyRemoveIt = (question) => {
    question.forEach(eachOption => {
        const labelContent = eachOption.innerText
        if (labelContent == '') {
            eachOption.remove()
        }
    })
}

ifOptionEmptyRemoveIt(quiz__options__imgLabel)
ifOptionEmptyRemoveIt(quiz__options__textLabelAll)

// ----------------------------------------------

if (quiz__questions) {
    typeOfQuiz = whatIsTypeOfQuiz()

    const numberOfQuestions = quiz__container.length
    let currentQuestion = 1

    quiz__numberOfQuestions.innerHTML = `تعداد سوال ها&nbsp:&nbsp&nbsp${numberOfQuestions}`
    quiz__questionCounter__totalAnswered.innerHTML = currentQuestion
    
    const pauseTheFunctionOfChangingQuestions = () => {
        quiz__questionChanger__next.classList.add('pointerOff')
        if (typeOfQuiz == 'pointy') {
            quiz__questionChanger__last.classList.add('pointerOff')
        }
        setTimeout(() => {
            quiz__questionChanger__next.classList.remove('pointerOff')
            if (typeOfQuiz == 'pointy') {
                quiz__questionChanger__last.classList.remove('pointerOff')
            }
        }, 1500)
    }

    let FinalTitleOfQuiz = ''
    const titleOfTheQuiz = () => {
        const titleOfQuiz = document.querySelector('.quiz__head h1').innerText
        const splittedTitleOfQuiz = titleOfQuiz.split(' ')
        splittedTitleOfQuiz.forEach(each => {
            FinalTitleOfQuiz += `-${each}`
        })
        return FinalTitleOfQuiz
    }
    
    const checkIfTheQuizEndedAndShowResultPage = () => {
        let FinalTitleOfQuiz = ''
        if (currentQuestion == numberOfQuestions) {
            FinalTitleOfQuiz = titleOfTheQuiz()
            if (typeOfQuiz == 'quiz') {
                calculateResult(FinalTitleOfQuiz)
            } else if (typeOfQuiz == 'pointy') {
                calculateResult_pointy(FinalTitleOfQuiz)
            }
        }
    }

    const plusOneToAnsweredQuestionsIfItsNotTheLast = () => {
        if (currentQuestion != numberOfQuestions + 1) {
            currentQuestion += 1
            quiz__questionCounter__totalAnswered.innerHTML = currentQuestion
        }
    }

    const next = -1076.05
    const last = +1076.05
    const goToAnotherQuestion = (changeToWhat) => {
        checkIfTheQuizEndedAndShowResultPage()
        plusOneToAnsweredQuestionsIfItsNotTheLast()
        shouldLetTheUserChooseAnotherOption('let')
        hideImGifTextAnswer()

        quiz__container.forEach(each => {
            currQuestionPosition = parseInt(getComputedStyle(each).transform.split(', ')[4])
            currQuestionPosition = currQuestionPosition + changeToWhat
            each.style.transform = `translate(${currQuestionPosition}px)`
        })
    }

    const goToAnotherQuestionWithDelay = (changeToWhat) => {
        setTimeout(() => {
            goToAnotherQuestion(changeToWhat)
        }, 5000);
        
    }

    const shouldLetTheUserChooseAnotherOption = (toDo) => {
        // toDo = let or doNot
        if (toDo == 'doNot') {
            quiz__questions.classList.add('pointerOff')
        } else {
            quiz__questions.classList.remove('pointerOff')
        }
    }

    const whatIsTheAnswer = () => {
        let answerOfQuestion = quiz__container__eachOne[currentQuestion - 1].getAttribute('data')
        answerOfQuestion = encodedNumbers[answerOfQuestion]
        return answerOfQuestion
    }

    const whatIsTheUserAnswer = (optionUserChose) => {
        optionUserChose = optionUserChose.id.slice(-1)
        return optionUserChose
    }

    const removeEmptyImGifText = () => {
        quiz__answerImGif.forEach(each => {
            const element = (each.innerHTML).trim()
            if (element.substring(element.length-39, element.length-27) == 'NotExist.jpg') {
                each.remove()
            }
        })
        quiz__answerText.forEach(each => {
            const element = (each.innerHTML).trim()
            if (element == 'None') {
                each.remove()
            }
        })
    }
    removeEmptyImGifText()

    const showImGifTextAnswer = () => {
        if (quiz__answerImGif[currentQuestion - 1]) {
            quiz__answerImGif[currentQuestion - 1].classList.remove('noVis')
        }
        if (quiz__answerText[currentQuestion - 1]) {
            quiz__answerText[currentQuestion - 1].classList.remove('noVis')
        }
    }

    const hideImGifTextAnswer = () => {
        if (quiz__answerImGif[currentQuestion - 2]) {
            removeDOM(quiz__answerImGif[currentQuestion - 2])
        }
        if (quiz__answerText[currentQuestion - 2]) {
            removeDOM(quiz__answerText[currentQuestion - 2])
        }
    }

    const showTheCorrectAnswer = (correctAnswer) => {
        const currentQuestionOptions = quiz__container__eachOne[currentQuestion - 1]
        const correctOption = currentQuestionOptions.querySelectorAll(`label`)[correctAnswer - 1]
        correctOption.classList.add('quiz__correctAnswer')
    }

    const checkUserAnswer = (each) => {
        const correctAnswer = whatIsTheAnswer()
        const userChose = whatIsTheUserAnswer(each)
        const userOption = `label[id='${each.id}']`
        const userOptionDOM = document.querySelector(userOption)
        showImGifTextAnswer()
        document.getElementById('quiz__top').scrollIntoView();
        if (userChose == correctAnswer) {
            userOptionDOM.classList.add('quiz__correctAnswer')
        } else {
            userOptionDOM.classList.add('quiz__wrongAnswer')
            showTheCorrectAnswer(correctAnswer)
        }
    }

    const scaleAnimationAfterChoosingAnswer = () => {
        quiz__hider.classList.add('quiz__options__scaleUp')

        setTimeout(() => {
            quiz__hider.classList.remove('quiz__options__scaleUp')
        }, 200)
    }

    quiz__options.forEach(each => {
        each.addEventListener('click', () => {
            scaleAnimationAfterChoosingAnswer()
            const switchBtn = quiz__autoQuestionChangerSwitch__innerBtn
            pauseTheFunctionOfChangingQuestions()

            if (typeOfQuiz == 'quiz') {
                shouldLetTheUserChooseAnotherOption('doNot')
                checkUserAnswer(each)
            }
            if (switchBtn.classList.contains('quiz__autoQuestionChangerSwitch__innerBtn__switched')) {
                goToAnotherQuestionWithDelay(next)
            }
        })
    })

    quiz__autoQuestionChangerSwitch.addEventListener('click', () => {
        const switchBtn = quiz__autoQuestionChangerSwitch__innerBtn
        if (switchBtn.classList.contains('quiz__autoQuestionChangerSwitch__innerBtn__switched')) {
            quiz__autoQuestionChangerSwitch__innerBtn.classList.remove('quiz__autoQuestionChangerSwitch__innerBtn__switched')
            fadeIn(quiz__questionChanger__next)
            if (typeOfQuiz == 'pointy') {
                fadeIn(quiz__questionChanger__last)
            }
        } else {
            quiz__autoQuestionChangerSwitch__innerBtn.classList.add('quiz__autoQuestionChangerSwitch__innerBtn__switched')
            fadeOut(quiz__questionChanger__next)
            if (typeOfQuiz == 'pointy') {
                fadeOut(quiz__questionChanger__last)
            }
        }
    })

    quiz__questionChanger__next.addEventListener('click', () => {
        goToAnotherQuestion(next)
        pauseTheFunctionOfChangingQuestions()
        shouldLetTheUserChooseAnotherOption('let')
    })

    const minusOneToAnsweredQuestionsIfItsNotTheFirst = () => {
        if (currentQuestion != 1) {
            currentQuestion -= 1
            quiz__questionCounter__totalAnswered.innerHTML = currentQuestion

        }
    }

    if (quiz__questionChanger__last) {
        quiz__questionChanger__last.addEventListener('click', () => {
            let currQuestionPosition = parseInt(getComputedStyle(quiz__container[0]).transform.split(', ')[4])
            if (currQuestionPosition > -500) {
                return "there is no last question"
            }
            minusOneToAnsweredQuestionsIfItsNotTheFirst()
            goToAnotherQuestion(last)
            pauseTheFunctionOfChangingQuestions()
        }) 
    }

} else {log('no nextQuestion btn')}



// -------------------------------------------------------------------------

const showCalculatingResult = () => {
    fadeIn(loadingScreen)
    fadeIn(countingResult)
}

const calculateResult = (FinalTitleOfQuiz) => {
    let lastQuiz = decodeURIComponent(window.location.href)
    const correctAnswerCounter = document.querySelectorAll(".quiz__container div form input[value='Y29ycmVjdA==']:checked").length
    const questionCounter = quiz__container.length
    const wrongAnswerCounter = questionCounter - correctAnswerCounter
    const score = ((correctAnswerCounter / (correctAnswerCounter + wrongAnswerCounter)) * 100).toFixed(0)
    try {
        localStorage.setItem('lastQuiz', lastQuiz)
        localStorage.setItem('correctAnswer', correctAnswerCounter)
        localStorage.setItem('wrongAnswer', wrongAnswerCounter)
        localStorage.setItem('score', score)
    } catch {
        alert('لطفا کوکی و ذخیره محلی خود را فعال کنید | Please enable your Cookies and LocalStorage')
    }

    urlParams = new URLSearchParams(window.location.search)
    subCategory = urlParams.get('ic')

    showCalculatingResult()
    setTimeout(() => {
        window.location.replace(`/result?ic=${subCategory}&t=${FinalTitleOfQuiz}`); 
    }, 3000)
}

const calculateResult_pointy = (FinalTitleOfQuiz) => {
    let lastQuiz = decodeURIComponent(window.location.href)
    try {
        localStorage.setItem('lastQuiz', lastQuiz)
    } catch {
        alert('لطفا کوکی و ذخیره محلی خود را فعال کنید | Please enable your Cookies and LocalStorage')
    }

    let score = 0
    const correctAnswerCounter = document.querySelectorAll(".quiz__container div form input:checked")
    correctAnswerCounter.forEach(each => {
        pointOfThisAnswer = parseInt(each.getAttribute('data'))
        score += pointOfThisAnswer
    })

    showCalculatingResult()
    setTimeout(() => {
        window.location.replace(`/resultPointy?t=${FinalTitleOfQuiz}&s=${score}`); 
    }, 3000)
}

log('quiz.js working ________________________________________________')

// log(" \n\n\
//                                     ((((Q)))))))))))))))) \n\
//                                 ((((((((Q)))))))))))))))))))) \n\
//                              ((((((((((((((((Q)))))))))))))))))) \n\
//                           (((((((((((((((((((((((U)))))))))))))))) \n\
//                        (((((((((((((((((((((((((((I)))))))))))))))) \n\
//                      (((((((((((((((((((((((((((((((Z)))))))))))))))) \n\
//                     (((((((((((((((((((((((((((((((((((L))))))))))))))) \n\
//                    (((((((((((((((((((((((((((((((((((((A))))))))))))))) \n\
//                   (((((((((((((((((/////////////////((((((N)))))))))))))) \n\
//                  ((((((((((((((((//                   (((((D))))))))))))) \n\
//                 /((((((((((((((//                       (((((.)))))))))))) \n\
//                 ((((((((((((((//                         (((((C))))))))))) \n\
//                 /(((((((((((((//                         (((((((O))))))))) \n\
//                 //((((((((((((//    -YOU ARE AWESOME-    (((((((((M))))))) \n\
//                 ///(((((((((((//                         (((((((((((❤)))) \n\
//                 ///(((((((((((//                         ((((((((((())))) \n\
//                 ///((((((((((((//                       (((((((((((((())) \n\
//                  ///(((((((((((((//                   (((((((((((((((()) \n\
//                   ///(((((((((((((//                ((((((((((((((((((( \n\
//                    ///(((((((((((((((    (((((((((((((((((((((((((((((( \n\
//                     ///((((((((((((((  ((((((((((((((((((((((((((((((( \n\
//                      ///(((((((((((   (((((((((((((((((((((((((((((( \n\
//                        ///((((((((   ((((((((((((((((((((((((((((( \n\
//                          ///((((     ((((((((((((((((((((((((( \n\
//                            /(((      ((((((((((((((((((((((( \n\
//                                      (((((((((((((((((((( \n\
//                                       ((((((((((((((( \n\
//                                         ((((((((((((( \n\
//                                         (((((((((((((( \n\
//                                          (((((((((((((( \n\
//                                          (((          ((( \n\
//                                          ((  (((((((((  (( \n\
//                                             (((     ((( \n\
//                                            (((       ((( \n\
//                                             (((     ((( \n\
//                                              ((((((((( \n\
// \n\n")