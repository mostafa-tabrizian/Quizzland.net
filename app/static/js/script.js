const takeParameterFromUrl = (parameter) => {
    const urlParams = new URLSearchParams(window.location.search);
    const parameterValue = urlParams.get(parameter)
    return parameterValue
}

const fadeIn = (element) => {
    element.classList.remove('fade-out')
    element.classList.add('fade-in')
}
const fadeOut = (element) => {
    element.classList.add('fade-out')
    element.classList.remove('fade-in')
}

const removeDOM = (element) => {
    element.remove()
}

//----------------------------------------------------------
// Loading screen
window.onload = (event) => {
    fadeOut(loadingScreen)
    setTimeout(() => {
        removeDOM(loadingScreen)
    }, 540)
}

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
    fadeIn(header__searchSubmit)
})
header__searchInput.addEventListener('blur', () => {
    fadeOut(header__searchSubmit)
})
//----------------------------------------------------------
// search in mobile
header__searchOpener.addEventListener('click', () => {
    if (header__searchOpener__bg.classList.contains('fade-out')) {
        fadeIn(header__searchOpener__bg)
        fadeIn(header__searchInput)
    } else {
        fadeOut(header__searchOpener__bg)
        fadeOut(header__searchInput)
    }
})
header__search__closeBtn.addEventListener('click', () => {
    if (header__searchOpener__bg.classList.contains('fade-out')) {
        fadeIn(header__searchOpener__bg)
        fadeIn(header__searchInput)
    } else {
        fadeOut(header__searchOpener__bg)
        fadeOut(header__searchInput)
    }
})

//----------------------------------------------------------
// sort changer
findTheSortByBtnName = {
    'گیمینگ 🎮': sort__gaming,
    'روانشناسی 🧠': sort__physiologies,
    'فیلم و سریال 🎬': sort__movieAndSeries,
    'سلبریتی ✨': sort__celebrities,
    'همه': sort__all,
}

let lastBtnThatClicked = sort__controller__btn[4]
let lastElementThatWereShown = sort__all

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
            fadeOut(lastElementThatWereShown)
            lastBtnThatClicked.classList.remove('sort__controller__selected')
            sortControllerBtn.classList.add('sort__controller__selected')
            setTimeout(() => {
                fadeIn(sortElement)
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

if (tools__sort__btn) {
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
    
    const tools__optionsDefine = {
        'newest': 'جدیدترین',
        'bestest': 'بهترین',
        'alphabet': 'الفبا',
        'جدیدترین': 'newest',
        'بهترین': 'bestest',
        'الفبا': 'alphabet'
    }

    const setTheCurrentSortToTools = () => {
        tools__sort__current.innerHTML = tools__optionsDefine[takeParameterFromUrl('st')]
        tools__numberOfResult__current.innerHTML = takeParameterFromUrl('nr')
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
    
    setTheCurrentSortToTools()
    
    tools__submit.addEventListener('click', () => {
        const currentSort = tools__optionsDefine[tools__sort__current.innerHTML]
        const currentNumberResult = tools__numberOfResult__current.innerHTML
        urlPath = window.location.pathname
        urlParams = new URLSearchParams(window.location.search)
        urlParams.set('st', currentSort)
        urlParams.set('nr', currentNumberResult)
        finalParameters = urlParams.toString()
        window.location.replace(urlPath + '?' + finalParameters); 
    })
} else {log('no tools')}

//----------------------------------------------------------
// submit the newsletter of user
let chosenCategory = []

newsletter__categoryOptions__input.forEach(each => {
    log(chosenCategory)
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
//----------------------------------------------------------
// newsletter pop up
newsletter__show.addEventListener('click', () => {
    fadeIn(newsletter)
    body.style.overflowY = 'hidden'
    newsletter__blurBackground.classList.add('newsletter__blurBackground__show')
})
newsletter__closeBtn.addEventListener('click', () => {
    fadeOut(newsletter)
    body.style.overflowY = 'overlay'
    newsletter__blurBackground.classList.remove('newsletter__blurBackground__show')
})

newsletter__submit.addEventListener('click', () => {
    userEmail = id_emailInput.value

    $.ajax({
        url: '/ajax/doesExistInNewsletterUsers/',
        data: {
            'userEmail': userEmail
        },
        dataType: 'json',
        success: function (data) {
            if (data.userEmail) {
                alert('شما از قبل ثبت نام کرده اید');
            }
            else{
                if (!(chosenCategory.length > 0)) {
                    newsletter__message.classList.remove('noVis')
                } else if (input__userName.value) {
                    alert('ثبت نام شما با موفقیت انجام شد')
                    return
                }
            }
        }
    });
})
//----------------------------------------------------------

// Page travel
if (pageTravel__arwNext) {
    const pathName = window.location.pathname

    const urlMakerForPageTravel = (currPageNumber) => {
        const lastPage = new URLSearchParams(window.location.search)
        const nextPage = new URLSearchParams(window.location.search)
        const nextTwoPage = new URLSearchParams(window.location.search)
        const finalPage = new URLSearchParams(window.location.search)
        lastPage.set('p', currPageNumber - 2)
        nextPage.set('p', currPageNumber)
        nextTwoPage.set('p', currPageNumber + 1)
        finalPage.set('p', parseInt(finalPageNumberDOM.innerHTML.trim()) - 1)
        const pages = {
            'lastPage': pathName +'?'+ lastPage.toString(),
            'nextPage': pathName +'?'+ nextPage .toString(),
            'nextTwoPage': pathName +'?'+ nextTwoPage.toString(),
            'finalPage': pathName +'?'+ finalPage.toString(),
        }
        return pages
    }
    
    const currPageNumber = parseInt(new URLSearchParams(window.location.search).get('p')) + 1
    pages = urlMakerForPageTravel(currPageNumber)

    pageTravel__pages__last.innerHTML = currPageNumber - 1
    pageTravel__arwLast.href = pages['lastPage']
    pageTravel__pages__last.href = pages['lastPage']

    pageTravel__pages__curr.innerHTML = currPageNumber

    pageTravel__pages__next.innerHTML = currPageNumber + 1
    pageTravel__pages__next.href = pages['nextPage']

    pageTravel__pages__nextTwo.innerHTML = currPageNumber + 2
    pageTravel__pages__nextTwo.href = pages['nextTwoPage']
    
    pageTravel__arwNext.href = pages['nextPage']

    finalPageNumberDOM.href = pages['finalPage']
    
    if (currPageNumber == 1) {
        removeDOM(pageTravel__arwLast)
        removeDOM(pageTravel__pages__last)
    }

    if (currPageNumber == finalPageNumberDOM.innerHTML) {
        removeDOM(pageTravel__arwNext)
        removeDOM(pageTravel__pages__next)
        removeDOM(pageTravel__pages__nextTwo)
        removeDOM(finalPageDOM)
    }

    if (currPageNumber + 1 == finalPageNumberDOM.innerHTML) {
        removeDOM(finalPageDOM)
        removeDOM(pageTravel__pages__nextTwo)
    }
    
    if (currPageNumber + 2 == finalPageNumberDOM.innerHTML) {
        removeDOM(finalPageDOM)
    }
} else { log ('no page travel')}

//----------------------------------------------------------
// search page
if (searchResult) {
    if (searchResult__category__item) {
        removeDOM(searchResult__category__item__notFound)
    }

    const countSearchResult = searchResult__quizzes__item.length

    if (countSearchResult && countSearchResult <= 1) {
        removeDOM(searchResult__quizzes__item__notFound)
        removeDOM(searchResult__quizzes__seeMore.querySelector('a'))
    } else if (countSearchResult && countSearchResult > 1) {
        removeDOM(searchResult__quizzes__item__notFound)
    } else {
        removeDOM(searchResult__quizzes__seeMore.querySelector('a'))
    }

} else {log('no search result page')}

//----------------------------------------------------------

if (backBtn) {
    backBtn.addEventListener('click', () => {
        event.preventDefault();
        history.go(-1)
    })
} else {log('no backBtn')}

//----------------------------------------------------------

if (result__share__btn) {
    result__share__btn.addEventListener('click', () => {
        lastQuiz = localStorage.getItem('lastQuiz')
        
        const quizTitle = result__title.innerHTML.slice(25,)
        const quizScore = result__score.innerHTML.split(' ')

        const messageShare =
            `من تو کوئیز (${quizTitle}) ${quizScore[1]} درصد درست زدم ${quizScore[0]}. تو چقدر میتونی بزنی ؟
            <br/> -----------------------------------------
            <br/> ${lastQuiz}`
        
        result__clipboard.innerHTML = messageShare
        new ClipboardJS('.result__share__btn');

        result__share__message.classList.remove('noVis')
    })
} else {log('no result share')}

if (resultQuizPointy__share__btn) {
    resultQuizPointy__share__btn.addEventListener('click', () => {
        lastQuiz = localStorage.getItem('lastQuiz')

        const quizTitle = resultQuizPointy__title.innerHTML.slice(25,)
        const quizResult = resultQuizPointy__resultTitle.innerHTML

        const messageShare =
            `😃 من تو تست ${quizTitle} ( ${quizResult} ) در اومدم. ببینیم تو چی در میای
            <br/> -----------------------------------------
            <br/> ${lastQuiz}`
        
        result__clipboard.innerHTML = messageShare
        new ClipboardJS('.resultQuizPointy__share__btn');

        result__share__message.classList.remove('noVis')
    })
} else {log('no resultPointy share')}


// --------------------------------------------------------------------

const nightThemeCss = document.createElement('link')
nightThemeCss.setAttribute('rel', 'stylesheet')
nightThemeCss.setAttribute('type', 'text/css')
nightThemeCss.setAttribute('href', "/static/css/nightTheme.css")

const nightMode_turnOff = () => {
    try {
        document.head.removeChild(nightThemeCss)
    } catch {log("it's default on lightMode no need removing")}
    nightMode.forEach (each => {
        each.classList.add('nightMode-Off')
        each.style.backgroundImage = 'url(/static/img/base/nightMode.png)'
        localStorage.setItem('mode', 'lightMode')
    })
}

const nightMode_turnOn = () => {
    document.head.appendChild(nightThemeCss)
    nightMode.forEach (each => {
        each.classList.remove('nightMode-Off')
        each.style.backgroundImage = 'url(/static/img/base/lightMode.png)'
        localStorage.setItem('mode', 'nightMode')
    })
}

userFavoriteMode = localStorage.getItem('mode')
if(navigator.userAgent.indexOf("Firefox") != -1 ) {
    if (userFavoriteMode == 'lightMode') {
        log('firefox no nightMode')
    } else {
        nightMode_turnOff()
    }
} else {
    if (userFavoriteMode == 'lightMode') {
        nightMode_turnOff()
    } else {
        nightMode_turnOn()
    }
}

if (nightMode) {
    const nightModeFunction = () => {
        if (nightMode[0].classList.contains('nightMode-Off')) {
            nightMode_turnOn()
        } else {
            nightMode_turnOff()
        }
    }

    nightMode.forEach(each => {
        each.addEventListener('click', () => {
            nightModeFunction()
        })
    })

} else {log ('no nightMode')}

// --------------------------------------------------------------------

// if (nightMode) {
//     checkTheUrlSoWeCheckIfShouldRemoveTheNightMode = takeParameterFromUrl()
//     log(checkTheUrlSoWeCheckIfShouldRemoveTheNightMode)
//     if (checkTheUrlSoWeCheckIfShouldRemoveTheNightMode.length == 9 || // innerCategory
//         checkTheUrlSoWeCheckIfShouldRemoveTheNightMode[3].includes('quiz')) 
//         {
//             try {
//                 nightMode__container.forEach(each => {
//                     each.classList.add('noVis')
//                 })
//                 nightMode.forEach(each => {
//                     each.classList.add('nightMode-Off')
//                 })
//                 document.head.removeChild(nightThemeCss)
//             } catch {
//                 log('no nightMode')
//             }
//         } 
//     else if (checkTheUrlSoWeCheckIfShouldRemoveTheNightMode[3] == 'result_2' ||
//         checkTheUrlSoWeCheckIfShouldRemoveTheNightMode[3] == 'resultPointy')
//         {
//             try {
//                 nightMode__container.forEach(each => {
//                     each.classList.add('noVis')
//                 })
//                 nightMode.forEach(each => {
//                     each.classList.remove('nightMode-Off')
//                 })
//                 document.head.appendChild(nightThemeCss)
//             } catch {
//                 log('no nightMode')
//             }
//         } 
        
// } else {log ('no nightMode')}

// --------------------------------------------------------------------
if(navigator.userAgent.indexOf("Firefox") != -1 ) {
    if (localStorage.getItem('alertUFHB') != 'True') {
        alert('لطفا از مرورگر کروم استفاده کنید \n در مرورگر شما (فایرفاکس) حالت شب و برخی دیزاین ها قابل اجرا نیست')
        // alert User For His Browser
        localStorage.setItem('alertUFHB', 'True')
    }
    if (pleaseUseChrome) {
        pleaseUseChrome.classList.remove('noVis')
    }
}

// --------------------------------------------------------------------
log('script working___________________________________________')

// -----------------------------GSAP
// hero animation
tl = gsap.timeline({defaults: { ease: "power2.inOut", duration: 1 }})
tl.from('.hero-inner', {y: '20%', opacity: 0, backdropFilter: 'blur(0px)',})

log('gsap Working._________________________________________')