const body = document.querySelector('body')
const loadingScreen = document.querySelector('.loadingScreen')
const backBtn = document.querySelector('.backBtn')

const nightMode = document.querySelectorAll('.nightMode')
const nightMode__container = document.querySelectorAll('.nightMode__container')

const header__categories__btn = document.querySelector('.header__categories__btn')
const header__categories = document.querySelector('.header__categories')
const header__quizzes__btn = document.querySelector('.header__quizzes__btn')
const header__quizzes = document.querySelector('.header__quizzes')
const header__menu = document.querySelector('.header__menu')
const header__menu__openBtn = document.querySelector('.header__menu__openBtn')
const header__menu__closeBtn = document.querySelector('.header__menu__closeBtn')
const id_searchInput = document.getElementById('id_searchInput')
const header__search__input = document.querySelector('.header__search__input')
const header__search__submit = document.querySelector('.header__search__submit')
const header__search__opener = document.querySelector('.header__search__opener')
const header__search__opener__bg = document.querySelector('.header__search__opener__bg')
const header__search__closeBtn = document.querySelector('.header__search__closeBtn')

const hero__path = document.querySelector('.hero__path')

const input__email = document.querySelector('.input__email')
const input__userName = document.querySelector('.input__userName')
const id_emailInput = document.getElementById('id_emailInput')
const newsletter__show = document.querySelector('.newsletter__show')
const newsletter__blurBackground__show = document.querySelector('.newsletter__blurBackground__show')
const newsletter = document.querySelector('.newsletter')
const newsletter__blurBackground = document.querySelector('.newsletter__blurBackground')
const newsletter__closeBtn = document.querySelector('.newsletter__closeBtn')
const newsletter__categoryOptions = document.querySelector('.newsletter__categoryOptions')
const newsletter__categoryOptions__input = document.querySelectorAll('.newsletter__categoryOptions input')
const newsletter__categoryOptions__selectedByUser = document.querySelector('.newsletter__categoryOptions__selectedByUser')
const newsletter__message = document.querySelector('.newsletter__message')
const newsletter__submit = document.querySelector('.newsletter__submit')

const tools__sort__btn = document.querySelector('.tools__sort__btn')
const tools__sort__options = document.querySelectorAll('.tools__sort__options > button')
const tools__sort__options__container = document.querySelector('.tools__sort__options__container')
const tools__sort__current = document.querySelector('.tools__sort__current')
const tools__numberOfResult__btn = document.querySelector('.tools__numberOfResult__btn')
const tools__numberOfResult__options = document.querySelectorAll('.tools__numberOfResult__options > button')
const tools__numberOfResult__options__container = document.querySelector('.tools__numberOfResult__options__container')
const tools__numberOfResult__current = document.querySelector('.tools__numberOfResult__current')
const tools__submit = document.querySelector('.tools__submit')

const sort__controller = document.querySelector('.sort__controller')
const sort__controller__selected = document.querySelector('.sort__controller__selected')
const sort__controller__btn = document.querySelectorAll('.sort__controller__btn')
const sort__all = document.querySelector('.sort__all')
const sort__celebrities = document.querySelector('.sort__celebrities')
const sort__movieAndSeries = document.querySelector('.sort__movieAndSeries')
const sort__gaming = document.querySelector('.sort__gaming')
const sort__physiologies = document.querySelector('.sort__physiologies')

const quizzes__item = document.querySelectorAll('.quizzes__item')

const pageTravel__arwNext = document.querySelector('.pageTravel__arwNext')
const pageTravel__arwLast = document.querySelector('.pageTravel__arwLast')
const pageTravel__pages__curr = document.querySelector('.pageTravel__pages__curr')
const pageTravel__pages__next = document.querySelector('.pageTravel__pages__next')
const pageTravel__pages__nextTwo = document.querySelector('.pageTravel__pages__nextTwo')
const pageTravel__pages__last = document.querySelector('.pageTravel__pages__last')

const finalPageDOM = document.querySelector('.finalPage')
const finalPageNumberDOM = document.querySelector('.finalPage > a')

const searchResult = document.querySelector('.searchResult')
const searchResult__category__item = document.querySelector('.searchResult__category__item')
const searchResult__category__item__notFound = document.querySelector('.searchResult__category__item__notFound')
const searchResult__quizzes__item = document.querySelectorAll('.searchResult__quizzes__item')
const searchResult__quizzes__item__notFound = document.querySelector('.searchResult__quizzes__item__notFound')
const searchResult__quizzes__seeMore = document.querySelector('.searchResult__quizzes__seeMore')

const quiz__hider = document.querySelector('.quiz__hider')
const quiz__container__eachOne = document.querySelectorAll(".quiz__container div form")
const quiz__questions = document.querySelector('.quiz__questions')
const quiz__questionChanger__next = document.querySelector('.quiz__questionChanger__next')
const quiz__bottomQuestionChanger__next = document.querySelector('.quiz__bottomQuestionChanger__next')
const quiz__questionChanger__last = document.querySelector('.quiz__questionChanger__last')
const quiz__numberOfQuestions = document.querySelector('.quiz__head h5')
const quiz__autoQuestionChangerSwitch = document.querySelector('.quiz__autoQuestionChangerSwitch')
const quiz__autoQuestionChangerSwitch__innerBtn = document.querySelector('.quiz__autoQuestionChangerSwitch__innerBtn')
const quiz__container = document.querySelectorAll('.quiz__container')
const quiz__questionCounter__totalAnswered = document.querySelector('.quiz__questionCounter__totalAnswered')
const quiz__imgQuestion = document.querySelectorAll('.quiz__imgQuestion')
const quiz__options = document.querySelectorAll('input[name=answer]')
const quiz__options__imgLabel = document.querySelectorAll('.quiz__options__imgLabel')
const quiz__options__textLabelAll = document.querySelectorAll('.quiz__options__textLabel')
const quiz__options__textLabel = document.querySelector('.quiz__options__textLabel')
const quiz__answerImGif = document.querySelectorAll('.quiz__answerImGif')
const quiz__answerText = document.querySelectorAll('.quiz__answerText')

const result__title = document.querySelector('.result__title h5')
const result__subtitle = document.querySelector('.result__subtitle')
const result__score = document.querySelector('.result__score')
const result__img = document.querySelector('.result__img')
const result__share__btn = document.querySelector('.result__share__btn')
const result__share__message= document.querySelector('.result__share__message')
const result__detail__correctTime = document.querySelector('.result__detail__correctTime')
const result__detail__wrongTime = document.querySelector('.result__detail__wrongTime')
const result__clipboard = document.querySelector('.result__clipboard')

const resultQuizPointy__title = document.querySelector('.resultQuizPointy__title')
const resultQuizPointy__resultTitle = document.querySelector('.resultQuizPointy__resultTitle')
const resultQuizPointy__share__btn = document.querySelector('.resultQuizPointy__share__btn')

const countingResult = document.querySelector('.countingResult')

const tryAgain__btn = document.querySelector('.tryAgain__btn')

const pleaseUseChrome = document.querySelector('.pleaseUseChrome')

const log = (code) => {
    console.log(code)
}

log('em')

// !############################################################################################################################################ QUIZ

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
        }
    }
}

// ----------------------------------------------

const ifOptionEmptyRemoveIt = (question) => {
    question.forEach(eachOption => {
        const labelContent = eachOption.innerText
        if (labelContent == '') {
            eachOption.remove()
        }
    })
}

const ifNoImgOptionRemoveIt = (img) => {
    img.forEach(each => {
        const src = each.querySelector('img').src
        if (src.includes('NotExist')) {
            each.remove()
        }
    })
}

ifNoImgOptionRemoveIt(quiz__options__imgLabel)
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
        quiz__bottomQuestionChanger__next.classList.add('pointerOff')
        if (typeOfQuiz == 'pointy') {
            quiz__questionChanger__last.classList.add('pointerOff')
        }
        setTimeout(() => {
            quiz__questionChanger__next.classList.remove('pointerOff')
            quiz__bottomQuestionChanger__next.classList.remove('pointerOff')
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
        document.getElementById('quiz__head').scrollIntoView()

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

    const removeEmptyImgQuestion = () => {
        quiz__imgQuestion.forEach(each => {
            const src = each.src
            if (src.includes('NotExist')) {
                each.remove()
            }
        })
    }
    removeEmptyImgQuestion()

    const removeEmptyImGifText = () => {
        quiz__answerImGif.forEach(each => {
            const src = each.querySelector('img').src
            if (src.includes('NotExist')) {
                each.remove()
            }
        })
        quiz__answerText.forEach(each => {
            const element = (each.innerText).trim()
            if (element == "") {
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
        document.getElementById('quiz__answerDetail').scrollIntoView(false)
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
                fadeIn(quiz__bottomQuestionChanger__next)
                checkUserAnswer(each)
            }
            if (switchBtn.classList.contains('quiz__autoQuestionChangerSwitch__innerBtn__switched')) {
                fadeOut(quiz__bottomQuestionChanger__next)
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
            fadeOut(quiz__bottomQuestionChanger__next)

            if (typeOfQuiz == 'pointy') {
                fadeOut(quiz__questionChanger__last)
            }
        }
    })

    quiz__questionChangerS = [quiz__questionChanger__next, quiz__bottomQuestionChanger__next]
    quiz__questionChangerS.forEach(each => {
        each.addEventListener('click', () => {
            goToAnotherQuestion(next)
            pauseTheFunctionOfChangingQuestions()
            shouldLetTheUserChooseAnotherOption('let')
        })
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
}

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

log('qz')


// !############################################################################################################################################ SCRIPT

const takeParameterFromUrl = (parameter) => {
    const urlParams = new URLSearchParams(window.location.search);
    const parameterValue = urlParams.get(parameter)
    return parameterValue
}

const fadeIn = (element) => {
    element.classList.remove('fade-out')
    element.classList.add('fade-in')
}
const fadeOut = (element) => {
    element.classList.add('fade-out')
    element.classList.remove('fade-in')
}

const removeDOM = (element) => {
    element.remove()
}

//----------------------------------------------------------
// Loading screen
window.onload = (event) => {
    fadeOut(loadingScreen)
    setTimeout(() => {
        removeDOM(loadingScreen)
    }, 540)
}

// open and close the category list when click on category in the list
header__categories__btn.addEventListener('click', () => {
    if (header__categories.classList.contains('subHeader__open')) {
        header__categories.classList.remove('subHeader__open')
    }
    else {
        header__categories.classList.add('subHeader__open')
    }
})
header__quizzes__btn.addEventListener('click', () => {
    if (header__quizzes.classList.contains('subHeader__open')) {
        header__quizzes.classList.remove('subHeader__open')
    }
    else {
        header__quizzes.classList.add('subHeader__open')
    }
})
body.addEventListener('click', () => {
    if (getComputedStyle(header__categories).opacity == 1) {
        header__categories.classList.remove('subHeader__open')
    }
    if (getComputedStyle(header__quizzes).opacity == 1) {
        header__quizzes.classList.remove('subHeader__open')
    }
})

//----------------------------------------------------------
// open the menu
header__menu__openBtn.addEventListener('click', () => {
    header__menu.classList.remove('slideMenu-hide')
})
header__menu__closeBtn.addEventListener('click', () => {
    header__menu.classList.add('slideMenu-hide')
})

//----------------------------------------------------------
// show the submit search btn when focus
header__search__input.addEventListener('click', () => {
    fadeIn(header__search__submit)
})
header__search__input.addEventListener('blur', () => {
    fadeOut(header__search__submit)
})
//----------------------------------------------------------
// search in mobile
header__search__opener.addEventListener('click', () => {
    if (header__search__opener__bg.classList.contains('fade-out')) {
        fadeIn(header__search__opener__bg)
        fadeIn(header__search__input)
    } else {
        fadeOut(header__search__opener__bg)
        fadeOut(header__search__input)
    }
})
header__search__closeBtn.addEventListener('click', () => {
    if (header__search__opener__bg.classList.contains('fade-out')) {
        fadeIn(header__search__opener__bg)
        fadeIn(header__search__input)
    } else {
        fadeOut(header__search__opener__bg)
        fadeOut(header__search__input)
    }
})

//----------------------------------------------------------
// sort changer
findTheSortByBtnName = {
    'گیمینگ 🎮': sort__gaming,
    'روانشناسی 🧠': sort__physiologies,
    'فیلم و سریال 🎬': sort__movieAndSeries,
    'سلبریتی ✨': sort__celebrities,
    'همه': sort__all,
}

const numberOfControllerBtn = sort__controller__btn.length
let lastBtnThatClicked = sort__controller__btn[numberOfControllerBtn - 1]
let lastElementThatWereShown = sort__all

const disableTheSortController = () => {
    sort__controller.classList.add('pointerOff')
}

const freeTheSortController = () => {
    sort__controller.classList.remove('pointerOff')
}

sort__controller__btn.forEach(sortControllerBtn => {
    sortControllerBtn.addEventListener('click', () => {
        disableTheSortController()

        const sortElement = findTheSortByBtnName[sortControllerBtn.innerHTML]
        if (sortElement.classList.contains('fade-out')) {
            fadeOut(lastElementThatWereShown)
            lastBtnThatClicked.classList.remove('sort__controller__selected')
            sortControllerBtn.classList.add('sort__controller__selected')
            setTimeout(() => {
                fadeIn(sortElement)
            }, 500)
            lastElementThatWereShown = sortElement
            lastBtnThatClicked = sortControllerBtn
        }
        setTimeout(() => {
            freeTheSortController()
        }, 600)

    })
})


//----------------------------------------------------------
// tools

if (tools__sort__btn) {
    tools__sort__btn.addEventListener('click', () => {
        if(tools__sort__options__container.classList.contains('fade-out')) {
            fadeIn(tools__sort__options__container)
        } else {
            fadeOut(tools__sort__options__container)
        }
    })
    
    tools__numberOfResult__btn.addEventListener('click', () => {
        if (tools__numberOfResult__options__container.classList.contains('fade-out')) {
            fadeIn(tools__numberOfResult__options__container)
        } else {
            fadeOut(tools__numberOfResult__options__container)
        }
    })
    
    body.addEventListener('click', () => {
        if (getComputedStyle(tools__sort__options__container).opacity == 1) {
            fadeOut(tools__sort__options__container)
        } 
        if(getComputedStyle(tools__numberOfResult__options__container).opacity == 1) {
            fadeOut(tools__numberOfResult__options__container)
        }
    })
    
    const tools__optionsDefine = {
        'newest': 'جدیدترین',
        'bestest': 'بهترین',
        'alphabet': 'الفبا',
        'جدیدترین': 'newest',
        'بهترین': 'bestest',
        'الفبا': 'alphabet'
    }

    const setTheCurrentSortToTools = () => {
        tools__sort__current.innerHTML = tools__optionsDefine[takeParameterFromUrl('st')]
        tools__numberOfResult__current.innerHTML = takeParameterFromUrl('nr')
    }
    
    tools__sort__options.forEach(each => {
        each.addEventListener('click', () => {
            tools__sort__current.innerHTML = each.innerHTML
        })
    })
    tools__numberOfResult__options.forEach(each => {
        each.addEventListener('click', () => {
            tools__numberOfResult__current.innerHTML = each.innerHTML
        })
    })
    
    setTheCurrentSortToTools()
    
    tools__submit.addEventListener('click', () => {
        const currentSort = tools__optionsDefine[tools__sort__current.innerHTML]
        const currentNumberResult = tools__numberOfResult__current.innerHTML
        urlPath = window.location.pathname
        urlParams = new URLSearchParams(window.location.search)
        urlParams.set('st', currentSort)
        urlParams.set('nr', currentNumberResult)
        finalParameters = urlParams.toString()
        window.location.replace(urlPath + '?' + finalParameters); 
    })
}

//----------------------------------------------------------
// newsletter pop up
newsletter__show.addEventListener('click', () => {
    fadeIn(newsletter)
    body.style.overflowY = 'hidden'
    newsletter__blurBackground.classList.add('newsletter__blurBackground__show')
})
newsletter__closeBtn.addEventListener('click', () => {
    fadeOut(newsletter)
    body.style.overflowY = 'overlay'
    newsletter__blurBackground.classList.remove('newsletter__blurBackground__show')
})



newsletter__submit.addEventListener('click', () => {
    userEmail = id_emailInput.value

    $.ajax({
        url: '/ajax/doesExistInNewsletterUsers/',
        data: 'userEmail='+encodeURIComponent ( userEmail ),
        dataType: 'json',
        scriptCharset: "utf-8",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: function (data) {
            if (data.userEmail) {
                alert('شما از قبل ثبت نام کرده اید');
            } else {
                responseLength = (document.querySelector('.g-recaptcha-response').value).length

                if (responseLength != 0) {
                    newsletter__submit.setAttribute('type', 'submit')
                } 
            }
        }
    });
})
//----------------------------------------------------------

// Page travel
if (pageTravel__arwNext) {
    const pathName = window.location.pathname

    const urlMakerForPageTravel = (currPageNumber) => {
        const lastPage = new URLSearchParams(window.location.search)
        const nextPage = new URLSearchParams(window.location.search)
        const nextTwoPage = new URLSearchParams(window.location.search)
        const finalPage = new URLSearchParams(window.location.search)
        lastPage.set('p', currPageNumber - 2)
        nextPage.set('p', currPageNumber)
        nextTwoPage.set('p', currPageNumber + 1)
        finalPage.set('p', parseInt(finalPageNumberDOM.innerHTML.trim()) - 1)
        const pages = {
            'lastPage': pathName +'?'+ lastPage.toString(),
            'nextPage': pathName +'?'+ nextPage .toString(),
            'nextTwoPage': pathName +'?'+ nextTwoPage.toString(),
            'finalPage': pathName +'?'+ finalPage.toString(),
        }
        return pages
    }
    
    const currPageNumber = parseInt(new URLSearchParams(window.location.search).get('p')) + 1
    pages = urlMakerForPageTravel(currPageNumber)

    pageTravel__pages__last.innerHTML = currPageNumber - 1
    pageTravel__arwLast.href = pages['lastPage']
    pageTravel__pages__last.href = pages['lastPage']

    pageTravel__pages__curr.innerHTML = currPageNumber

    pageTravel__pages__next.innerHTML = currPageNumber + 1
    pageTravel__pages__next.href = pages['nextPage']

    pageTravel__pages__nextTwo.innerHTML = currPageNumber + 2
    pageTravel__pages__nextTwo.href = pages['nextTwoPage']
    
    pageTravel__arwNext.href = pages['nextPage']

    finalPageNumberDOM.href = pages['finalPage']
    
    if (currPageNumber == 1) {
        removeDOM(pageTravel__arwLast)
        removeDOM(pageTravel__pages__last)
    }

    if (currPageNumber == finalPageNumberDOM.innerHTML) {
        removeDOM(pageTravel__arwNext)
        removeDOM(pageTravel__pages__next)
        removeDOM(pageTravel__pages__nextTwo)
        removeDOM(finalPageDOM)
    }

    if (currPageNumber + 1 == finalPageNumberDOM.innerHTML) {
        removeDOM(finalPageDOM)
        removeDOM(pageTravel__pages__nextTwo)
    }
    
    if (currPageNumber + 2 == finalPageNumberDOM.innerHTML) {
        removeDOM(finalPageDOM)
    }
}

//----------------------------------------------------------
// search page
if (searchResult) {
    if (searchResult__category__item) {
        removeDOM(searchResult__category__item__notFound)
    }

    const countSearchResult = searchResult__quizzes__item.length

    if (countSearchResult && countSearchResult <= 1) {
        removeDOM(searchResult__quizzes__item__notFound)
        removeDOM(searchResult__quizzes__seeMore.querySelector('a'))
    } else if (countSearchResult && countSearchResult > 1) {
        removeDOM(searchResult__quizzes__item__notFound)
    } else {
        removeDOM(searchResult__quizzes__seeMore.querySelector('a'))
    }
}

//----------------------------------------------------------

if (backBtn) {
    backBtn.addEventListener('click', () => {
        event.preventDefault();
        history.go(-1)
    })
}

//----------------------------------------------------------

if (result__share__btn) {
    result__share__btn.addEventListener('click', () => {
        lastQuiz = localStorage.getItem('lastQuiz')
        
        const quizTitle = result__title.innerHTML.slice(25,)
        const quizScore = result__score.innerHTML.split(' ')

        const messageShare =
            `من تو کوئیز (${quizTitle}) ${quizScore[1]} درصد درست زدم ${quizScore[0]}. تو چقدر میتونی بزنی ؟
            <br/> -----------------------------------------
            <br/> ${lastQuiz}`
        
        result__clipboard.innerHTML = messageShare
        new ClipboardJS('.result__share__btn');

        result__share__message.classList.remove('noVis')
    })
}

if (resultQuizPointy__share__btn) {
    resultQuizPointy__share__btn.addEventListener('click', () => {
        lastQuiz = localStorage.getItem('lastQuiz')

        const quizTitle = resultQuizPointy__title.innerHTML.slice(25,)
        const quizResult = resultQuizPointy__resultTitle.innerHTML

        const messageShare =
            `😃 من تو تست ${quizTitle} ( ${quizResult} ) در اومدم. ببینیم تو چی در میای
            <br/> -----------------------------------------
            <br/> ${lastQuiz}`
        
        result__clipboard.innerHTML = messageShare
        new ClipboardJS('.resultQuizPointy__share__btn');

        result__share__message.classList.remove('noVis')
    })
}

// TryAgain btn link
if (tryAgain__btn) {
    tryAgain__btn.href = localStorage.getItem('lastQuiz')
}

// --------------------------------------------------------------------

const nightThemeCss = document.createElement('link')
nightThemeCss.setAttribute('rel', 'stylesheet')
nightThemeCss.setAttribute('type', 'text/css')
nightThemeCss.setAttribute('href', "/static/css/nightTheme.min.css")

const nightMode_turnOff = () => {
    try {
        document.head.removeChild(nightThemeCss)
    } catch {}
    nightMode.forEach (each => {
        if (hero__path) {
            hero__path.style.background = 'url(/static/img/Base/landPage-path-light.png) no-repeat center center'
            hero__path.style.backgroundSize = 'cover'
        }
        each.classList.add('nightMode-Off')
        each.style.backgroundImage = 'url(/static/img/Base/lightMode.png)'
        localStorage.setItem('mode', 'lightMode')
    })
}

const nightMode_turnOn = () => {
    document.head.appendChild(nightThemeCss)
    if (hero__path) {
        hero__path.style.background = 'url(/static/img/Base/landPage-path.png) no-repeat center center'
        hero__path.style.backgroundSize = 'cover'
    }
    nightMode.forEach (each => {
        each.classList.remove('nightMode-Off')
        each.style.backgroundImage = 'url(/static/img/Base/nightMode.png)'
        localStorage.setItem('mode', 'nightMode')
    })
}

userFavoriteMode = localStorage.getItem('mode')
if (userFavoriteMode == 'lightMode') {
    nightMode_turnOff()
} else {
    nightMode_turnOn()
}

if (nightMode) {
    const nightModeFunction = () => {
        if (nightMode[0].classList.contains('nightMode-Off')) {
            nightMode_turnOn()
        } else {
            nightMode_turnOff()
        }
    }

    nightMode.forEach(each => {
        each.addEventListener('click', () => {
            nightModeFunction()
        })
    })
}

// --------------------------------------------------------------------
if (nightMode) {
    const url = (window.location.pathname).split('/')
    if (url.length == 4 /* innerCategory */) 
        {
            try {
                nightMode__container.forEach(each => {
                    each.classList.add('noVis')
                })
                nightMode.forEach(each => {
                    each.classList.add('nightMode-Off')
                })
                document.head.removeChild(nightThemeCss)
            } catch {}
        } 
    else if (url.includes('resultPointy') ||
             url.includes('quiz'))
        {
            try {
                nightMode__container.forEach(each => {
                    each.classList.add('noVis')
                })
                nightMode.forEach(each => {
                    each.classList.remove('nightMode-Off')
                })
                document.head.appendChild(nightThemeCss)
            } catch {}
        } 
}

// --------------------------------------------------------------------
if(navigator.userAgent.indexOf("Firefox") != -1 ) {
    if (localStorage.getItem('alertUFHB') != 'True') {
        alert('لطفا از مرورگر کروم یا غیره استفاده کنید \n در مرورگر شما (فایرفاکس) برخی دیزاین ها قابل اجرا نیست')
        // alert User For His Browser
        localStorage.setItem('alertUFHB', 'True')
    }
    if (pleaseUseChrome) {
        pleaseUseChrome.classList.remove('noVis')
    }
}

log('st')