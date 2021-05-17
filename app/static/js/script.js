//----------------------------------------------------------

// Loading screen
window.onload = (event) => {
    loadingScreen.classList.add('fade')
};

//----------------------------------------------------------

// open and close the category list when click on category in the list
header__categories__button.addEventListener('click', () => {
    if (header__categories.classList.contains('header__categories__open')) {
        header__categories.classList.remove('header__categories__open')
    }
    else {
        header__categories.classList.add('header__categories__open')
    }
})
body.addEventListener('click', () => {
    if (getComputedStyle(categories).opacity == 1) {
        categories.classList.remove('header__categories__open')
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

// show the submit search btn when active
header__searchInput.addEventListener('click', () => {
    header__searchSubmit.classList.remove('fade')
})
header__searchInput.addEventListener('blur', () => {
    header__searchSubmit.classList.add('fade')
})

//----------------------------------------------------------

// show the submit search category btn when active
try {

    tools__search.addEventListener('click', () => {
        tools__submit.classList.remove('fade')
    })
    tools__search.addEventListener('blur', () => {
        tools__submit.classList.add('fade')
    })

    tools__sortType.addEventListener('click', () => {
        if (tools__sortType__options.classList.contains('fade')) {
            tools__sortType__options.classList.remove('fade')
        } else {
            tools__sortType__options.classList.add('fade')
        }
    })

    sort__newest.addEventListener('click', () => {
        tools__sortType__current.innerHTML = 'جدیدترین ها'
    })
    sort__oldest.addEventListener('click', () => {
        tools__sortType__current.innerHTML = 'قدیمی‌ترین ها'
    })
    sort__bestest.addEventListener('click', () => {
        tools__sortType__current.innerHTML = 'بهترین‌ ها'
    })
    sort__alphabet.addEventListener('click', () => {
        tools__sortType__current.innerHTML = 'الفبا'


        // let quizzes__item__sort = []

        // for (let i = 0; i < quizzes__item.length; i++) {
        //     quizzes__item__sort.push(quizzes__item[i])
        // }
        
        // quizzes__item__sort.sort((a, b) => { 
        //     a = a.id.toLowerCase();
        //     b = b.id.toLowerCase();
        //     if (a > b) { 
        //         return 1; 
        //     } else if (a < b) {
        //         return -1;
        //     } else {
        //         return 0;
        //     }
        // })

        // for (let i = 0; i < quizzes__item.length; i++) {
        //     quizzes__item__sort[i].style.order = i
        // }
    })
} catch {
    log('Tools Not Found!')
}

//----------------------------------------------------------

// newsletter pop up
newsletter__show.addEventListener('click', () => {
    newsletter.classList.remove('fade')
    body.style.overflowY = 'hidden'
    newsletter__blurBackground.classList.add('newsletter__blurBackground__show')
})
newsletter__closeBtn.addEventListener('click', () => {
    newsletter.classList.add('fade')
    body.style.overflowY = 'overlay'
    newsletter__blurBackground.classList.remove('newsletter__blurBackground__show')
})

//----------------------------------------------------------

// submit the newsletter of user
try {
    let chosenCategory = []
    
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
} catch {
    log('no newsletter')
}

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
    const fullUrl = window.location.href
    const splitUrl = fullUrl.split('/')

    const urlMakerForPageTravel = (currPageNumber, baseUrl) => {
        lastPage = baseUrl + (currPageNumber - 1) 
        nextPage = baseUrl + (currPageNumber + 1)
        nextTwoPage = baseUrl + (currPageNumber + 2)
        finalPage = baseUrl + (parseInt(finalPageNumberDOM.innerHTML.trim()) - 1)
    }
    
    if  (!(isNaN(parseInt(splitUrl[4])))) { //sortPages
        baseUrl = '/' + splitUrl[3] + '/'
        currPageNumber = parseInt(splitUrl[4])
        urlMakerForPageTravel(currPageNumber, baseUrl)

    } else if (!(isNaN(parseInt(splitUrl[5])))) { //category
        baseUrl = '/' + splitUrl[3] + '/' + splitUrl[4] + '/'
        currPageNumber = parseInt(splitUrl[5])
        urlMakerForPageTravel(currPageNumber, baseUrl)

    } else if  (!(isNaN(parseInt(splitUrl[6])))) { //innerCategory
        baseUrl = '/' + splitUrl[3] + '/' + splitUrl[4] + '/' + splitUrl[5] + '/'
        currPageNumber = parseInt(splitUrl[6])
        urlMakerForPageTravel(currPageNumber, baseUrl)

    }

    pageTravel__pages__last.innerHTML = currPageNumber
    pageTravel__arwLast.href = lastPage
    pageTravel__pages__last.href = lastPage

    pageTravel__pages__curr.innerHTML = currPageNumber + 1

    pageTravel__pages__next.innerHTML = currPageNumber + 2
    pageTravel__pages__next.href = nextPage

    pageTravel__pages__nextTwo.innerHTML = currPageNumber + 3
    pageTravel__pages__nextTwo.href = nextTwoPage
    
    pageTravel__arwNext.href = nextPage

    finalPageNumberDOM.href = finalPage
    
    if (currPageNumber == 0) {
        pageTravel__arwLast.classList.add('noVis')
        pageTravel__pages__last.classList.add('noVis')
    }

    if (currPageNumber + 1 == finalPageNumberDOM.innerHTML) {
        pageTravel__arwNext.classList.add('noVis')
        pageTravel__pages__next.classList.add('noVis')
        pageTravel__pages__nextTwo.classList.add('noVis')
        finalPageDOM.classList.add('noVis')
    }

    if (currPageNumber + 2 == parseInt(finalPageNumberDOM.innerHTML)) {
        finalPageDOM.classList.add('noVis')
        pageTravel__pages__nextTwo.classList.add('noVis')
    }
    
    if (currPageNumber + 3 == finalPageNumberDOM.innerHTML) {
        finalPageDOM.classList.add('noVis')
    }
} catch (e) {
    log('No page travel')
}

//----------------------------------------------------------

// searchResult page
try {
    try {
        searchResult__category__item.addEventListener('click', () => {return})
    } catch {
        searchResult__category__item__notFound.innerHTML = 'هیچ کتگوری پیدا نشد <br> لطفا از عبارتی دیگر یا زبان دیگر دوباره تلاش کنید'
    }

    const countSearchResult = searchResult__quizzes.childElementCount

    if (countSearchResult == 4) { // empty
        searchResult__quizzes__item__notFound.innerHTML = 'هیچ کوئیزی پیدا نشد <br> لطفا از عبارتی دیگر یا زبان دیگر دوباره تلاش کنید'
    }

    if (countSearchResult == 4 || countSearchResult <= 11) {
        searchResult__quizzes__seeMore.querySelector('a').classList.add('noVis') 
    }
} catch {log('no search result page')}

//----------------------------------------------------------

// quiz questions
try {
    let currentQuestion = 1
    const numberOfQuestions = quiz__container.length

    quiz__numberOfQuestions.innerHTML = `سوال&nbsp:&nbsp&nbsp${numberOfQuestions}`
    quiz__questionCounter__totalQuestions.innerHTML = numberOfQuestions
    quiz__questionCounter__totalAnswered.innerHTML = currentQuestion
    
    const pauseTheFunctionOfChangingQuestions = () => {
        quiz__questionChanger__next.style.pointerEvents = 'none';
        quiz__questionChanger__last.style.pointerEvents = 'none';
        setTimeout(() => {
            quiz__questionChanger__next.style.pointerEvents = 'visible';
            quiz__questionChanger__last.style.pointerEvents = 'visible';
        }, 1500)
    }
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
            calculateResult()
            FinalTitleOfQuiz = titleOfTheQuiz()
            window.location.replace(`/result/${FinalTitleOfQuiz}`); 
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
            goToAnotherQuestion(next)
            pauseTheFunctionOfChangingQuestions()
            checkIfTheQuizEndedAndShowResultPage()
        })
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
} catch (e) { log('no nextQuestion btn')}

//----------------------------------------------------------

try {
    backBtn.addEventListener('click', () => {
        log('back')
        event.preventDefault();
        history.go(-1)
    })
} catch {
    log('no backBtn')
}