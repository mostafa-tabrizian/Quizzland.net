export const log = (code) => {
    console.log(code)
}

export const getTheme = () => {
    const theme = localStorage.getItem('theme')

    if (theme == 'light') {
        document.documentElement.style.setProperty('--color', 'black')
        document.documentElement.style.setProperty('--placeholder', 'black')
        document.documentElement.style.setProperty('--brightness', 'brightness(1)')
        document.documentElement.style.setProperty('--background', '#cbcbcbf5')
    }
    else {  // whatever other than light is black
        document.documentElement.style.setProperty('--color', '#f0f0f0')
        document.documentElement.style.setProperty('--placeholder', '#5d5d5d')
        document.documentElement.style.setProperty('--brightness', 'brightness(0.4)')
        document.documentElement.style.setProperty('--background', '#0e0202fa')
    }

    return theme
}

export const keyPressedOnInput = (e) => {
    if (e.key == 'Enter') {
        const valueEnteredReadyToSearch = replaceFunction(e.target.value, ' ', '+')
        valueEnteredReadyToSearch.length &&
        window.open(`/search?q=${valueEnteredReadyToSearch}`, '_blank')
    }
}

export const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
}

export const sortByNewest = (a, b) => {
    return new Date(b.publish) - new Date(a.publish);
}

export const sortByMonthlyViews = (a, b) => {
    return b.monthly_views - a.monthly_views;
}

export const sortByViews = (a, b) => {
    return b.views - a.views;
}

export const sortByAlphabet = (a, b) => {
    return b.title - a.title;
}

export const takeParameterFromUrl = (parameter) => {
    const urlParams = new URLSearchParams(window.location.search);
    const parameterValue = urlParams.get(parameter)
    return parameterValue
}

export const replaceFunction = (string, oldValue, newValue) => {
    return decodeURI(string.replaceAll(oldValue, newValue))
}

export const viewsFormat = (views) => {
    if (views >= 1000) {
        const stringed = toString(views)
        const newViewsFormat = stringed[0] + '.' + stringed[1] + 'k'
        return newViewsFormat
    } else {
        return views
    }
}

export const fadeIn = (element) => {
    element.classList.remove('fadeOut')
    element.classList.add('fadeIn')
}

export const fadeOut = (element) => {
    element.classList.add('fadeOut')
    element.classList.remove('fadeIn')
}

export const datePublishHandler = (publishFullDate) => {
    const publishHour = publishFullDate.slice(11, 13)
    const publishDay = publishFullDate.slice(8, 10)
    const publishMonth = publishFullDate.slice(5, 7) - 1
    const publishYear = publishFullDate.slice(0, 4)

    const publishUnixTime = new Date(Date.UTC(publishYear, publishMonth, publishDay, publishHour, '0', '0'))
    const currentUnixTime = Date.now()

    const convertToYear = (time) => time / 1000 / 60 / 60 / 24 / 30 / 365
    const convertToMonth = (time) => time / 1000 / 60 / 60 / 24 / 30
    const convertToDay = (time) => time / 1000 / 60 / 60 / 24
    const convertToHour = (time) => time / 1000 / 60 / 60

    const yearsPast = Math.floor(convertToYear(currentUnixTime - publishUnixTime))
    const monthsPast = Math.floor(convertToMonth(currentUnixTime - publishUnixTime))
    const daysPast = Math.floor(convertToDay(currentUnixTime - publishUnixTime))
    const hoursPast = Math.floor(convertToHour(currentUnixTime - publishUnixTime))

    if (yearsPast >= 1) {
        return `${yearsPast} سال پیش`

    } else if (monthsPast >= 1) {
        return `${monthsPast} ماه پیش`

    } else if (daysPast >= 1) {
        return `${daysPast} روز پیش`

    } else if (hoursPast >= 1) {
        return `${hoursPast} ساعت پیش`

    } else {
        return 'چند دقیقه پیش'
    }
}

export const makeDatePublishFormatForQuizDetail = (fullDate) => {
    if (fullDate) {
        const year = parseInt(fullDate.slice(0, 4))
        const month = parseInt(fullDate.slice(5, 7)) - 1
        const day = parseInt(fullDate.slice(8, 10))
        const hour = parseInt(fullDate.slice(11, 13))
        const minute = parseInt(fullDate.slice(14, 16))
        const second = parseInt(fullDate.slice(17, 20))

        const newDate = new Date(year, month, day, hour, minute, second)
        const persianDate = newDate.toLocaleDateString('fa-IR').split('/')

        let monthsInPersian

        switch (persianDate[1]) {
            case '۱':
                monthsInPersian = 'فروردين'
                break;
            case '۲':
                monthsInPersian = 'ارديبهشت'
                break
            case '۳':
                monthsInPersian = 'خرداد'
                break
            case '۴':
                monthsInPersian = 'تير'
                break
            case '۵':
                monthsInPersian = 'مرداد'
                break
            case '۶':
                monthsInPersian = 'شهريور'
                break
            case '۷':
                monthsInPersian = 'مهر'
                break
            case '۸':
                monthsInPersian = 'آبان'
                break
            case '۹':
                monthsInPersian = 'آذر'
                break
            case '۱۰':
                monthsInPersian = 'دي'
                break
            case '۱۱':
                monthsInPersian = 'بهمن'
                break
            case '۱۲':
                monthsInPersian = 'اسفند'
                break
        }

        return `${persianDate[2]} ${monthsInPersian} ${persianDate[0]}`
    }
}

export const isItDesktop = () => {
    return window.navigator.userAgent.includes('Windows')
}

export const isItMobile = () => {
    return window.navigator.userAgent.includes('Mobile') && !(window.navigator.userAgent.includes('iPad'))
}

export const isItIPad = () => {
    return window.navigator.userAgent.includes('Mobile') && window.navigator.userAgent.includes('iPad')
}