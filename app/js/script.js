const log = (code) => {
    console.log(code)
}

// close the category list when click on anywhere of page
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
categoriesBtn.addEventListener('click', appearCategories)
function appearCategories() {
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
}

// open the menu
const btnMenu = document.querySelector('.header__menu')
const btnMenuClose = document.querySelector('.header__menu__m__close-btn')
const menu = document.querySelector('.header__menu__m')

btnMenu.addEventListener('click', openMenu)
function openMenu() {
    menu.classList.remove('header__menu__close')
}

btnMenuClose.addEventListener('click', closeMenu)
function closeMenu() {
    log('working..')
    menu.classList.add('header__menu__close')
}