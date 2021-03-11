const log = (code) => {
    console.log(code)
}

// close the category list or hide the submit btn when click on anywhere of page
const body = document.querySelector('body')
body.addEventListener('click', () => {
    const categories = document.querySelector('.header__categories')
    const arw = document.querySelector('.arw')
    
    if (getComputedStyle(categories).opacity == 1) {
        categories.classList.remove('header__categories__open')
        arw.classList.remove('arw__open')
    }
})

// open and close the category list when click on category in the list
const categoriesBtn = document.querySelector('.header__categories__button')
categoriesBtn.addEventListener('click', () => {
    const categories = document.querySelector('.header__categories')
    const arw = document.querySelector('.arw')
    const categoriesStyle = getComputedStyle(categories)
    const close = categoriesStyle.opacity == 0
    
    if (close) {
        categories.classList.add('header__categories__open')
        arw.classList.add('arw__open')
        
    } else {
        categories.classList.remove('header__categories__open')
        arw.classList.remove('arw__open')
    }
})

// open the menu
const btnMenu = document.querySelector('.header__menu')
const btnMenuClose = document.querySelector('.header__menu__m__close-btn')
const menu = document.querySelector('.header__menu__m')

btnMenu.addEventListener('click', () => {
    menu.classList.remove('fade')
})

btnMenuClose.addEventListener('click', () => {
    menu.classList.add('fade')

})

// show the submit srch btn when active
const header__search = document.querySelector('.header__search')
const header__submit = document.querySelector('.header__submit')
header__search.addEventListener('click', () => {
    header__submit.classList.remove('fade')
})
header__search.addEventListener('blur', () => {
    header__submit.classList.add('fade')
})

// show the submit srch category btn when active
const tools__search = document.querySelector('.tools__search')
const tools__submit = document.querySelector('.tools__submit')
tools__search.addEventListener('click', () => {
    tools__submit.classList.remove('fade')
})
tools__search.addEventListener('blur', () => {
    tools__submit.classList.add('fade')
})

// show the detail of the category
const categories__item = document.querySelectorAll('.categories__item')

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