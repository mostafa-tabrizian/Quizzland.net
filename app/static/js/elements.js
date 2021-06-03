const body = document.querySelector('body')
const loadingScreen = document.querySelector('.loadingScreen')
const backBtn = document.querySelector('.backBtn')

const nightMode__link = document.querySelector('.nightMode__link')
const nightMode = document.querySelectorAll('.nightMode')
const nightMode__container = document.querySelectorAll('.nightMode__container')

const header__categories__btn = document.querySelector('.header__categories__btn')
const header__categories = document.querySelector('.header__categories')
const header__quizzes__btn = document.querySelector('.header__quizzes__btn')
const header__quizzes = document.querySelector('.header__quizzes')
const header__menu = document.querySelector('.header__menu')
const header__menu__openBtn = document.querySelector('.header__menu__openBtn')
const header__menu__closeBtn = document.querySelector('.header__menu__closeBtn')
const header__searchInput = document.querySelector('.header__searchInput')
const header__searchInput__m = document.querySelector('.header__searchInput__m')
const header__searchSubmit = document.querySelector('.header__searchSubmit')
const header__searchShow = document.querySelector('.header__searchShow')

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
const categories__item = document.querySelectorAll('.categories__item')

const pageTravel__arwNext = document.querySelector('.pageTravel__arwNext')
const pageTravel__arwLast = document.querySelector('.pageTravel__arwLast')
const pageTravel__pages__curr = document.querySelector('.pageTravel__pages__curr')
const pageTravel__pages__next = document.querySelector('.pageTravel__pages__next')
const pageTravel__pages__nextTwo = document.querySelector('.pageTravel__pages__nextTwo')
const pageTravel__pages__last = document.querySelector('.pageTravel__pages__last')

const finalPageDOM = document.querySelector('.finalPage')
const finalPageNumberDOM = document.querySelector('.finalPage > a')

const searchResult__category__item = document.querySelector('.searchResult__category__item')
const searchResult__category__item__notFound = document.querySelector('.searchResult__category__item__notFound')
const searchResult__quizzes = document.querySelector('.searchResult__quizzes')
const searchResult__quizzes__item = document.querySelector('.searchResult__quizzes__item')
const searchResult__quizzes__item__notFound = document.querySelector('.searchResult__quizzes__item__notFound')
const searchResult__quizzes__seeMore = document.querySelector('.searchResult__quizzes__seeMore')

const quiz__hider = document.querySelector('.quiz__hider')
const quiz__container__eachOne = document.querySelectorAll(".quiz__container div form")
const quiz__questions = document.querySelector('.quiz__questions')
const quiz__questionChanger__next = document.querySelector('.quiz__questionChanger__next')
const quiz__questionChanger__last = document.querySelector('.quiz__questionChanger__last')
const quiz__numberOfQuestions = document.querySelector('.quiz__head h5')
const quiz__autoQuestionChangerSwitch = document.querySelector('.quiz__autoQuestionChangerSwitch')
const quiz__autoQuestionChangerSwitch__innerBtn = document.querySelector('.quiz__autoQuestionChangerSwitch__innerBtn')
const quiz__container = document.querySelectorAll('.quiz__container')
const quiz__questionCounter__totalAnswered = document.querySelector('.quiz__questionCounter__totalAnswered')
const quiz__questionCounter__totalQuestions = document.querySelector('.quiz__questionCounter__totalQuestions')
const quiz__options = document.querySelectorAll('input[name=answer]')

const result__title = document.querySelector('.result__title h3')
const result__subtitle = document.querySelector('.result__subtitle')
const result__score = document.querySelector('.result__score')
const result__share__btn = document.querySelector('.result__share__btn')
const result__share__message= document.querySelector('.result__share__message')
const result__detail__correctTime = document.querySelector('.result__detail__correctTime')
const result__detail__wrongTime = document.querySelector('.result__detail__wrongTime')
const result__clipboard = document.querySelector('.result__clipboard')

const resultQuizPointy__title = document.querySelector('.resultQuizPointy__title')
const resultQuizPointy__resultTitle = document.querySelector('.resultQuizPointy__resultTitle')
const resultQuizPointy__share__btn = document.querySelector('.resultQuizPointy__share__btn')

const countingResult = document.querySelector('.countingResult')

const pleaseUseChrome = document.querySelector('.pleaseUseChrome')

const log = (code) => {
    console.log(code)
}

log('elements.js working____________________________________________________')