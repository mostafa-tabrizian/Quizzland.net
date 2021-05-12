const log = (code) => {
    console.log(code)
}

const body = document.querySelector('body')
const hero = document.querySelector('.hero')
const loadingScreen = document.querySelector('.loadingScreen')
const header__categories__button = document.querySelector('.header__categories__button')
const header__categories = document.querySelector('.header__categories')
const arw = document.querySelector('.arw')
const categories = document.querySelector('.header__categories')
const btnMenu = document.querySelector('.header__menu')
const btnMenuClose = document.querySelector('.header__menu__m__close-btn')
const menu = document.querySelector('.header__menu__m')
const header__searchInput = document.querySelector('.header__searchInput')
const header__searchSubmit = document.querySelector('.header__searchSubmit')
const tools__search = document.querySelector('.tools__search')
const tools__submit = document.querySelector('.tools__submit')
const tools__sortType = document.querySelector('.tools__sortType')
const tools__sortType__current = document.querySelector('.tools__sortType__current')
const tools__sortType__options = document.querySelector('.tools__sortType__options')
const sort__newest = document.querySelector('#newest')
const sort__oldest = document.querySelector('#oldest')
const sort__bestest = document.querySelector('#bestest')
const sort__alphabet = document.querySelector('#alphabet')
const quizzes__item = document.querySelectorAll('.quizzes__item')
const categories__item = document.querySelectorAll('.categories__item')
const heightFooter = (document.querySelector('footer').offsetTop) - 780;
const pageTravel__arwNext = document.querySelector('.pageTravel__arwNext')
const pageTravel__arwLast = document.querySelector('.pageTravel__arwLast')
const pageTravel__pages__curr = document.querySelector('.pageTravel__pages__curr')
const pageTravel__pages__next = document.querySelector('.pageTravel__pages__next')
const pageTravel__pages__nextTwo = document.querySelector('.pageTravel__pages__nextTwo')
const pageTravel__pages__last = document.querySelector('.pageTravel__pages__last')
const lastPageDOM = document.querySelector('.lastPage')
const lastPageNumberDOM = document.querySelector('.lastPage > a')
const searchResult__category__item = document.querySelector('.searchResult__category__item')
const searchResult__category__item__notFound = document.querySelector('.searchResult__category__item__notFound')
const searchResult__quizzes = document.querySelector('.searchResult__quizzes')
const searchResult__quizzes__item__notFound = document.querySelector('.searchResult__quizzes__item__notFound')
const searchResult__quizzes__seeMore = document.querySelector('.searchResult__quizzes__seeMore')
const quiz__nextQuestion = document.querySelector('.quiz__nextQuestion')
const quiz__container = document.querySelectorAll('.quiz__container')

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

// show the detail of the category

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
    log(splitUrl)
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

try {
    searchResult__category__item.addEventListener('click', () => {
        try {
            searchResult__category__item.addEventListener('click', () => {return})
        } catch (e) {
            searchResult__category__item__notFound.innerHTML = 'هیچ کتگوری پیدا نشد'
            searchResult__category__item__notFound.classList.add('space-sm')
        }
        
        try {
            searchResult__quizzes__item__notFound.addEventListener('click', () => {return})
        } catch (e) {
            searchResult__quizzes__item__notFound.innerHTML = 'کویزی پیدا نشد'
            searchResult__quizzes__item__notFound.classList.add('space-sm')
        }
    })
} catch (e) { log('no searchResult ')}


try {
    const countSearchResult = searchResult__quizzes.childElementCount
    if (countSearchResult == 4) { // empty
        searchResult__quizzes__seeMore.innerHTML = 'هیچ کویزی پیدا نشد'
    } else if (countSearchResult <= 11) {
        // searchResult__quizzes__seeMore.querySelector('a').classList.add('noVis') 
        }
} catch (e) { log('no search result') }

try {
    quiz__nextQuestion.addEventListener('click', () => {
        quiz__nextQuestion.style.pointerEvents = 'none';
        log('nextQuestion')
        for (i = 0; i < quiz__container.length; i++) {
            log(quiz__container[i])
            lastQuestionPosition = parseInt(getComputedStyle(quiz__container[i]).left) - 1076.05
            log(lastQuestionPosition)
            quiz__container[i].style.left = `${lastQuestionPosition}px`
        }
        setTimeout(() => {
            quiz__nextQuestion.style.pointerEvents = 'visible';
        }, 2000)
    })
} catch (e) { log('no nextQuestion btn')}








// GSAP
try {
    gsap.registerPlugin(ScrollTrigger)

    // hide the ad when reach the footer
    gsap.to('.ad__r', {
        scrollTrigger: {
            trigger: 'footer',
            markers: false,
            start: '5% 100%',
            scrub: .1,
        },
        x: '200%',
        opacity: '0',
    })

    // Counting left
    log(heightFooter)

    gsap.to('.quiz__leftCounter', {
        scrollTrigger: {
            trigger: '.quiz__questions',
            markers: false,
            start: 'top top',
            end: heightFooter,
            scrub: 1,
        },
        width: '100%',
    })
} catch (e) {log('no gsap')}

// hero animation
tl = gsap.timeline({defaults: { ease: "power2.inOut", duration: 1 }})
tl.from('.hero-inner', {y: '20%', opacity: 0, backdropFilter: 'blur(0px)',})
// tl.from('header', {y: '-100%'}, '-=.7')

log('Script Working.')