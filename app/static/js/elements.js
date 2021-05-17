const body = document.querySelector('body')
const hero = document.querySelector('.hero')

const loadingScreen = document.querySelector('.loadingScreen')

const header__categories__button = document.querySelector('.header__categories__button')
const header__categories = document.querySelector('.header__categories')
// const arw = document.querySelector('.arw')
const categories = document.querySelector('.header__categories')
const backBtn = document.querySelector('.backBtn')

const header__menu = document.querySelector('.header__menu')
const header__menu__openBtn = document.querySelector('.header__menu__openBtn')
const header__menu__closeBtn = document.querySelector('.header__menu__closeBtn')
const header__searchInput = document.querySelector('.header__searchInput')
const header__searchSubmit = document.querySelector('.header__searchSubmit')

const newsletter__chooseCategory = document.querySelector('.newsletter__chooseCategory')
const newsletter__categoryOptions = document.querySelector('.newsletter__categoryOptions')
const newsletter__categoryOptions__input = document.querySelectorAll('.newsletter__categoryOptions input')
const newsletter__categoryOptions__selectedByUser = document.querySelector('.newsletter__categoryOptions__selectedByUser')

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

const finalPageDOM = document.querySelector('.finalPage')
const finalPageNumberDOM = document.querySelector('.finalPage > a')

const searchResult__category__item = document.querySelector('.searchResult__category__item')
const searchResult__category__item__notFound = document.querySelector('.searchResult__category__item__notFound')
const searchResult__quizzes = document.querySelector('.searchResult__quizzes')
const searchResult__quizzes__item = document.querySelector('.searchResult__quizzes__item')
const searchResult__quizzes__item__notFound = document.querySelector('.searchResult__quizzes__item__notFound')
const searchResult__quizzes__seeMore = document.querySelector('.searchResult__quizzes__seeMore')

const quiz__questionChanger__next = document.querySelector('.quiz__questionChanger__next')
const quiz__questionChanger__last = document.querySelector('.quiz__questionChanger__last')
const quiz__numberOfQuestions = document.querySelector('.quiz__head h5')
const quiz__container = document.querySelectorAll('.quiz__container')
const quiz__questionCounter__totalAnswered = document.querySelector('.quiz__questionCounter__totalAnswered')
const quiz__questionCounter__totalQuestions = document.querySelector('.quiz__questionCounter__totalQuestions')
const quiz__options = document.querySelectorAll('input[name=answer]')

const quiz__container__eachOne = document.querySelectorAll(".quiz__container div form")
const result__score = document.querySelector('.result__score')
const result__subtitle__txt = document.querySelector('.result__subtitle__txt')
const result__detail__correctTime = document.querySelector('.result__detail__correctTime')
const result__detail__wrongTime = document.querySelector('.result__detail__wrongTime')

const log = (code) => {
    console.log(code)
}

log('elements.js working')