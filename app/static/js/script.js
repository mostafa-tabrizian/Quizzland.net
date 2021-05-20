const splitUrl = () => {
    const fullUrl = window.location.href
    const splitUrl = fullUrl.split('/')
    return splitUrl
}

//----------------------------------------------------------

// Loading screen
window.onload = (event) => {
    loadingScreen.classList.add('fade-out')
    loadingScreen.classList.remove('fade-in')
};

//----------------------------------------------------------

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

header__searchInput.addEventListener('click', () => {
    header__searchSubmit.classList.remove('fade-out')
    header__searchSubmit.classList.add('fade-in')
})
header__searchInput.addEventListener('blur', () => {
    header__searchSubmit.classList.add('fade-out')
    header__searchSubmit.classList.remove('fade-in')
})

//----------------------------------------------------------
// sort changer
findTheSortByBtnName = {
    'گیمینگ': sort__gaming,
    'روانشناسی': sort__physiologies,
    'فیلم و سریال': sort__movieAndSeries,
    'سلبریتی': sort__celebrities,
}

let lastBtnThatClicked = sort__controller__btn[3]
let lastElementThatWereShown = sort__celebrities

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
            lastElementThatWereShown.classList.remove('fade-in')
            lastElementThatWereShown.classList.add('fade-out')
            lastBtnThatClicked.classList.remove('sort__controller__selected')
            sortControllerBtn.classList.add('sort__controller__selected')
            setTimeout(() => {
                sortElement.classList.remove('fade-out')
                sortElement.classList.add('fade-in')
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

try {
    const currentUrl = splitUrl()
    
    const fadeIn = (element) => {
        element.classList.remove('fade-out')
        element.classList.add('fade-in')
    }
    const fadeOut = (element) => {
        element.classList.add('fade-out')
        element.classList.remove('fade-in')
    }
    
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
    
    const setTheCurrentSortToTools = (currentUrl) => {
        if (!(isNaN(parseInt(currentUrl[5])))) { //category
            tools__sort__current.innerHTML = tools__optionsDefine[currentUrl[6]]
            tools__numberOfResult__current.innerHTML = currentUrl[7]
    
        } else if  (!(isNaN(parseInt(currentUrl[6])))) { //innerCategory
            tools__sort__current.innerHTML = tools__optionsDefine[currentUrl[7]]
            tools__numberOfResult__current.innerHTML = currentUrl[8]
        }
    }

    const tools__optionsDefine = {
        'newest': 'جدیدترین',
        'bestest': 'بهترین',
        'alphabet': 'الفبا',
        'جدیدترین': 'newest',
        'بهترین': 'bestest',
        'الفبا': 'alphabet'
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

    const whichPageItIsForMakingTheUrl = (currentUrl) => {
        if (!(isNaN(parseInt(currentUrl[5])))) { //category
            const category = currentUrl[4]
            const currentSort = tools__sort__current.innerHTML
            const currentNumberResult = tools__numberOfResult__current.innerHTML
            const whichPageItIs = `/category/${category}/0/${tools__optionsDefine[currentSort]}/${currentNumberResult}`
            return whichPageItIs
        
        } else if  (!(isNaN(parseInt(currentUrl[6])))) { //innerCategory
            const category = currentUrl[4]
            const innerCategory = currentUrl[5]
            const currentSort = tools__optionsDefine[tools__sort__current.innerHTML]
            const currentNumberResult = tools__numberOfResult__current.innerHTML
            const whichPageItIs = `/category/${category}/${innerCategory}/0/${currentSort}/${currentNumberResult}`
            return whichPageItIs
        }
    }

    setTheCurrentSortToTools(currentUrl)

    tools__submit.addEventListener('click', () => {
        whichPageItIs = whichPageItIsForMakingTheUrl(currentUrl)
        window.location.replace(whichPageItIs); 
    })

} catch (e) {log(`Tools Not Found! ${e}`)}

//----------------------------------------------------------

// newsletter pop up
newsletter__show.addEventListener('click', () => {
    newsletter.classList.remove('fade-out')
    newsletter.classList.add('fade-in')
    body.style.overflowY = 'hidden'
    newsletter__blurBackground.classList.add('newsletter__blurBackground__show')
})
newsletter__closeBtn.addEventListener('click', () => {
    newsletter.classList.add('fade-out')
    newsletter.classList.remove('fade-in')
    body.style.overflowY = 'overlay'
    newsletter__blurBackground.classList.remove('newsletter__blurBackground__show')
})
newsletter__submit.addEventListener('click', () => {
    const numberOfCheckedOption = newsletter__categoryOptions__selectedByUser.innerHTML.split(',').length
    log(numberOfCheckedOption)
    if (numberOfCheckedOption == 1) {
        newsletter__message.classList.remove('noVis')
    } else {
        newsletter__submit.setAttribute('type', 'submit')
    }
})

//----------------------------------------------------------

// submit the newsletter of user
try {
    let chosenCategory = [,]
    
    newsletter__categoryOptions__input.forEach(each => {
        each.addEventListener('click', () => {
            inputOfTheCategory = each.checked
            if (inputOfTheCategory == true) { //checked
                chosenCategory.push(each.id)
            } else {
                indexOfChosenToRemove = chosenCategory.indexOf(each.id)
                chosenCategory.splice(indexOfChosenToRemove, 1)
            }

            newsletter__categoryOptions__selectedByUser.innerHTML = chosenCategory
        })
    })
} catch {log('no newsletter')}

//----------------------------------------------------------

// Show the detail of the category
// categories__item.forEach(item => 
//     item.addEventListener('mouseover', () => {
//         const categories__item__img = item.querySelector('.categories__item__img')
//         categories__item__img.classList.add('categories__item__detail__show')
//     })
// )
    
// categories__item.forEach(item =>
//     item.addEventListener('mouseout', () => {
//         const categories__item__img = item.querySelector('.categories__item__img')
//         categories__item__img.classList.remove('categories__item__detail__show')
//     })
// )

//----------------------------------------------------------

// Page travel
try {
    splitUrl = splitUrl()

    const urlMakerForPageTravel = (currPageNumber, baseUrlPart1, baseUrlPart2) => {
        lastPage = baseUrlPart1 + (currPageNumber - 2) + baseUrlPart2
        nextPage = baseUrlPart1 + (currPageNumber) + baseUrlPart2
        nextTwoPage = baseUrlPart1 + (currPageNumber + 1) + baseUrlPart2
        finalPage = baseUrlPart1 + (parseInt(finalPageNumberDOM.innerHTML.trim()) - 1)  + baseUrlPart2
    }
    
    if  (!(isNaN(parseInt(splitUrl[4])))) { //sortPages
        baseUrlPart1 = '/' + splitUrl[3] + '/'
        baseUrlPart2 = '/' + splitUrl[5]
        currPageNumber = parseInt(splitUrl[4]) + 1
        urlMakerForPageTravel(currPageNumber, baseUrlPart1, baseUrlPart2)

    } else if (!(isNaN(parseInt(splitUrl[5])))) { //category
        baseUrlPart1 = '/' + splitUrl[3] + '/' + splitUrl[4] + '/'
        baseUrlPart2 = '/' + splitUrl[6] + '/' + splitUrl[7]
        currPageNumber = parseInt(splitUrl[5]) + 1
        urlMakerForPageTravel(currPageNumber, baseUrlPart1, baseUrlPart2)

    } else if  (!(isNaN(parseInt(splitUrl[6])))) { //innerCategory
        baseUrlPart1 = '/' + splitUrl[3] + '/' + splitUrl[4] + '/' + splitUrl[5] + '/'
        baseUrlPart2 = '/' + splitUrl[7] + '/' + splitUrl[8]
        currPageNumber = parseInt(splitUrl[6]) + 1
        urlMakerForPageTravel(currPageNumber, baseUrlPart1, baseUrlPart2)
    }

    pageTravel__pages__last.innerHTML = currPageNumber - 1
    pageTravel__arwLast.href = lastPage
    pageTravel__pages__last.href = lastPage

    pageTravel__pages__curr.innerHTML = currPageNumber

    pageTravel__pages__next.innerHTML = currPageNumber + 1
    pageTravel__pages__next.href = nextPage

    pageTravel__pages__nextTwo.innerHTML = currPageNumber + 2
    pageTravel__pages__nextTwo.href = nextTwoPage
    
    pageTravel__arwNext.href = nextPage

    finalPageNumberDOM.href = finalPage
    
    if (currPageNumber == 1) {
        pageTravel__arwLast.classList.add('noVis')
        pageTravel__pages__last.classList.add('noVis')
    }

    if (currPageNumber == finalPageNumberDOM.innerHTML) {
        pageTravel__arwNext.classList.add('noVis')
        pageTravel__pages__next.classList.add('noVis')
        pageTravel__pages__nextTwo.classList.add('noVis')
        finalPageDOM.classList.add('noVis')
    }

    if (currPageNumber + 1 == finalPageNumberDOM.innerHTML) {
        finalPageDOM.classList.add('noVis')
        pageTravel__pages__nextTwo.classList.add('noVis')
    }
    
    if (currPageNumber + 2 == finalPageNumberDOM.innerHTML) {
        finalPageDOM.classList.add('noVis')
    }
} catch {log('No page travel')}

//----------------------------------------------------------

// searchResult page
try {
    try {
        searchResult__category__item.addEventListener('click', () => {return})
    } catch {
        searchResult__category__item__notFound.innerHTML = 'هیچ کتگوری پیدا نشد <br> لطفا از عبارتی دیگر یا زبان دیگر دوباره تلاش کنید'
    }

    const countSearchResult = searchResult__quizzes.childElementCount
    log(countSearchResult)

    if (countSearchResult == 3) { // empty
        searchResult__quizzes__item__notFound.innerHTML = 'هیچ کوئیزی پیدا نشد <br> لطفا از عبارتی دیگر یا زبان دیگر دوباره تلاش کنید'
        searchResult__quizzes__seeMore.querySelector('a').classList.add('noVis') 
    }

    if (countSearchResult == 3 || countSearchResult <= 11) {
        searchResult__quizzes__seeMore.querySelector('a').classList.add('noVis') 
    }

} catch {log('no search result page')}

//----------------------------------------------------------

// quiz questions
try {
    const typeOfQuiz = quiz__questions.getAttribute('tag')
    localStorage.setItem('typeOfQuiz', typeOfQuiz)
    const numberOfQuestions = quiz__container.length
    let currentQuestion = 1

    quiz__numberOfQuestions.innerHTML = `سوال&nbsp:&nbsp&nbsp${numberOfQuestions}`
    quiz__questionCounter__totalQuestions.innerHTML = numberOfQuestions
    quiz__questionCounter__totalAnswered.innerHTML = currentQuestion
    
    const pauseTheFunctionOfChangingQuestions = () => {
        quiz__questionChanger__next.classList.add('pointerOff')
        quiz__questionChanger__last.classList.add('pointerOff')
        setTimeout(() => {
            quiz__questionChanger__next.classList.remove('pointerOff')
            quiz__questionChanger__last.classList.remove('pointerOff')
        }, 1500)
    }

    let FinalTitleOfQuiz = ''
    const titleOfTheQuiz = () => {
        const titleOfQuiz = document.querySelector('.quiz__head h3').innerText
        const splittedTitleOfQuiz = titleOfQuiz.split(' ')
        splittedTitleOfQuiz.forEach(each => {
            FinalTitleOfQuiz += `-${each}`
        })
        return FinalTitleOfQuiz
    }
    const checkIfTheQuizEndedAndShowResultPage = () => {
        let FinalTitleOfQuiz = ''
        if (currentQuestion - 1 == numberOfQuestions) {
            FinalTitleOfQuiz = titleOfTheQuiz()
            if (typeOfQuiz == 'quiz') {
                calculateResult(FinalTitleOfQuiz)
            } else if (typeOfQuiz == '4Option') {
                calculateResult_4Option(FinalTitleOfQuiz)
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
        quiz__container.forEach(each => {
            currQuestionPosition = parseInt(getComputedStyle(each).left)
            currQuestionPosition = currQuestionPosition + changeToWhat
            each.style.left = `${currQuestionPosition}px`
        })
    }

    const minusOneToAnsweredQuestionsIfItsNotTheFirst = () => {
        if (currentQuestion != 1) {
            currentQuestion = currentQuestion - 1
            quiz__questionCounter__totalAnswered.innerHTML = currentQuestion
        }
    }

    quiz__options.forEach(each => {
        each.addEventListener('click', () => {
            plusOneToAnsweredQuestionsIfItsNotTheLast()
            const switchBtn = quiz__autoQuestionChangerSwitch__innerBtn
            if (!(switchBtn.classList.contains('quiz__autoQuestionChangerSwitch__innerBtn__switched'))) {
                goToAnotherQuestion(next)
            }
            pauseTheFunctionOfChangingQuestions()
            checkIfTheQuizEndedAndShowResultPage()
        })
    })

    quiz__autoQuestionChangerSwitch__btn.addEventListener('click', () => {
        const switchBtn = quiz__autoQuestionChangerSwitch__innerBtn
        if (switchBtn.classList.contains('quiz__autoQuestionChangerSwitch__innerBtn__switched')) {
            quiz__autoQuestionChangerSwitch__innerBtn.classList.remove('quiz__autoQuestionChangerSwitch__innerBtn__switched')
        } else {
            quiz__autoQuestionChangerSwitch__innerBtn.classList.add('quiz__autoQuestionChangerSwitch__innerBtn__switched')
            quiz__container.style.transitionDelay = '.5s';
        }
    })

    quiz__questionChanger__next.addEventListener('click', () => {
        plusOneToAnsweredQuestionsIfItsNotTheLast()
        goToAnotherQuestion(next)
        pauseTheFunctionOfChangingQuestions()
        checkIfTheQuizEndedAndShowResultPage()
    })

    quiz__questionChanger__last.addEventListener('click', () => {
        if (currQuestionPosition > -500) {
            return "there is no last question"
        }
        minusOneToAnsweredQuestionsIfItsNotTheFirst()
        goToAnotherQuestion(last)
        pauseTheFunctionOfChangingQuestions()
        checkIfTheQuizEndedAndShowResultPage()
    }) 
} catch {log('no nextQuestion btn')}

//----------------------------------------------------------

try {
    backBtn.addEventListener('click', () => {
        event.preventDefault();
        history.go(-1)
    })
} catch {log('no backBtn')}