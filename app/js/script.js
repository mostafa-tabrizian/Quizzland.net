const log = (code) => {
    console.log(code)
}

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