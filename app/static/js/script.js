// Loading screen
window.onload = (event) => {
    loadingScreen.classList.add('fade')
};

// open and close the category list when click on category in the list
header__categories__button.addEventListener('click', () => {
    
    if (header__categories.classList.contains('header__categories__open')) {
        header__categories.classList.remove('header__categories__open')
        arw.classList.remove('arw__open')
    }
    else {
        header__categories.classList.add('header__categories__open')
        arw.classList.add('arw__open')
    }
})

// close the category list or hide the submit btn when click on anywhere of page
body.addEventListener('click', () => {
    
    if (getComputedStyle(categories).opacity == 1) {
        categories.classList.remove('header__categories__open')
        arw.classList.remove('arw__open')
    }
})

// open the menu

btnMenu.addEventListener('click', () => {
    menu.classList.remove('fade')
})

btnMenuClose.addEventListener('click', () => {
    menu.classList.add('fade')
})

// show the submit srch btn when active
header__searchInput.addEventListener('click', () => {
    header__searchSubmit.classList.remove('fade')
})
header__searchInput.addEventListener('blur', () => {
    header__searchSubmit.classList.add('fade')
})

// show the submit srch category btn when active
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


        let quizzes__item__sort = []

        for (let i = 0; i < quizzes__item.length; i++) {
            quizzes__item__sort.push(quizzes__item[i])
        }
        
        quizzes__item__sort.sort((a, b) => { 
            a = a.id.toLowerCase();
            b = b.id.toLowerCase();
            if (a > b) { 
                return 1; 
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        })

        for (let i = 0; i < quizzes__item.length; i++) {
            quizzes__item__sort[i].style.order = i
        }
    })
} catch {
    log('Tools Not Found!')
}

// Show the detail of the category
categories__item.forEach(item => 
    item.addEventListener('mouseover', () => {
        const categories__item__img = item.querySelector('.categories__item__img')
        categories__item__img.classList.add('categories__item__detail__show')
    })
)
    
categories__item.forEach(item =>
    item.addEventListener('mouseout', () => {
        const categories__item__img = item.querySelector('.categories__item__img')
        categories__item__img.classList.remove('categories__item__detail__show')
    })
)

// Page travel
try {
    const fullUrl = window.location.href
    const splitUrl = fullUrl.split('/')
    const currPageNumber = parseInt(splitUrl[5])
    const lastPage = '/' + splitUrl[3] + '/' + splitUrl[4] + '/' + (currPageNumber - 1)
    const nextPage = '/' + splitUrl[3] + '/' + splitUrl[4] + '/' + (currPageNumber + 1)
    const nextTwoPage = '/' + splitUrl[3] + '/' + splitUrl[4] + '/' + (currPageNumber + 2)

    pageTravel__pages__last.innerHTML = currPageNumber - 1
    pageTravel__arwLast.href = lastPage
    pageTravel__pages__last.href = lastPage

    pageTravel__pages__curr.innerHTML = currPageNumber

    pageTravel__pages__next.innerHTML = currPageNumber + 1
    pageTravel__pages__next.href = nextPage

    pageTravel__pages__nextTwo.innerHTML = currPageNumber + 2
    pageTravel__pages__nextTwo.href = nextTwoPage
    
    pageTravel__arwNext.href = nextPage
    
    if (currPageNumber == 0) {
        pageTravel__arwLast.classList.add('noVis')
        pageTravel__pages__last.classList.add('noVis')
    }

    
    if (currPageNumber + 1 == lastPageNumberDOM.innerHTML) {
        pageTravel__pages__nextTwo.classList.add('noVis')
        lastPageDOM.classList.add('noVis')
    }
    
    if (currPageNumber + 2 == lastPageNumberDOM.innerHTML) {
        lastPageDOM.classList.add('noVis')
    }

    if (currPageNumber == lastPageNumberDOM.innerHTML) {
        pageTravel__arwNext.classList.add('noVis')
        pageTravel__pages__next.classList.add('noVis')
        pageTravel__pages__nextTwo.classList.add('noVis')
        lastPageDOM.classList.add('noVis')
    }
    
} catch {
    log('No page travel')
}

// searchResult page
try {
    try {
        searchResult__category__item.addEventListener('click', () => {return})
    } catch (e) {
        searchResult__category__item__notFound.innerHTML = 'هیچ کتگوری پیدا نشد'
        searchResult__category__item__notFound.classList.add('space-sm')
    }

    const countSearchResult = searchResult__quizzes.childElementCount
    if (countSearchResult == 4) { // empty
        searchResult__quizzes__seeMore.innerHTML = 'هیچ کویزی پیدا نشد'
    } else if (countSearchResult <= 11) {
        searchResult__quizzes__seeMore.querySelector('a').classList.add('noVis') 
        }
} catch (e) { log('no search result page') }

// quiz questions
try {
    let currentQuestion = 0
    const numberOfQuestions = quiz__container.length

    quiz__questionCounter__totalAnswered.innerHTML = currentQuestion + 1
    quiz__questionCounter__totalQuestions.innerHTML = numberOfQuestions
    quiz__numberOfQuestions.innerHTML = `سوال&nbsp:&nbsp&nbsp${numberOfQuestions}`

    quiz__nextQuestion.addEventListener('click', () => {
        currentQuestion++

        if (currentQuestion != numberOfQuestions) {
            quiz__questionCounter__totalAnswered.innerHTML = currentQuestion + 1
        }

        quiz__nextQuestion.style.pointerEvents = 'none';

        quiz__container.forEach(each => {
            log(each)
            lastQuestionPosition = parseInt(getComputedStyle(each).left) - 1076.05
            each.style.left = `${lastQuestionPosition}px`
        })
        
        setTimeout(() => {
            quiz__nextQuestion.style.pointerEvents = 'visible';
        }, 1500)

        let FinalTitleOfQuiz = ''

        if (currentQuestion >= numberOfQuestions) {
            calculateResult()
            const titleOfQuiz = document.querySelector('.quiz__head h3').innerText
            const splittedTitleOfQuiz = titleOfQuiz.split(' ')
            const lengthOfTitle = splittedTitleOfQuiz.length
            for (i = 0; i < lengthOfTitle; i++) {
                FinalTitleOfQuiz = FinalTitleOfQuiz + '-' + splittedTitleOfQuiz[i]
            }

            window.location.replace(`/result/${FinalTitleOfQuiz}`);
        }
    })


} catch (e) { log('no nextQuestion btn')}