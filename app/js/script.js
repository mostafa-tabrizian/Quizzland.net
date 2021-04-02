const log = (code) => {
    console.log(code)
}

// open and close the category list when click on category in the list
const header__categories__button = document.querySelector('.header__categories__button')
header__categories__button.addEventListener('click', () => {
    const header__categories = document.querySelector('.header__categories')
    const arw = document.querySelector('.arw')
    
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
const body = document.querySelector('body')
body.addEventListener('click', () => {
    const categories = document.querySelector('.header__categories')
    const arw = document.querySelector('.arw')
    
    if (getComputedStyle(categories).opacity == 1) {
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
try {
    const tools__search = document.querySelector('.tools__search')
    const tools__submit = document.querySelector('.tools__submit')
    const tools__sortType = document.querySelector('.tools__sortType')
    const tools__sortType__current = document.querySelector('.tools__sortType__current')
    const tools__sortType__options = document.querySelector('.tools__sortType__options')
    const sort__newest = document.querySelector('#newest')
    const sort__oldest = document.querySelector('#oldest')
    const sort__bestest = document.querySelector('#bestest')
    const sort__alphabet = document.querySelector('#alphabet')

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

        const quizzes__item = document.querySelectorAll('.quizzes__item')

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
    const height = document.body.clientHeight;
    const heightFooter = (document.querySelector('footer').offsetTop) - 780;
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

tl = gsap.timeline({defaults: { ease: "power2.inOut", duration: 2.5 }})
// tl.from('.hero-inner', {y: '20%', opacity: 0, backdropFilter: 'blur(0px)',})
// tl.from('header', {y: '-100%'}, '-=1')


log('Script Working.')