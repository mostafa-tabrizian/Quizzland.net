export const log = (code) => {
    console.log(code)
}

export const takeParameterFromUrl = (parameter) => {
    const urlParams = new URLSearchParams(window.location.search);
    const parameterValue = urlParams.get(parameter)
    return parameterValue
}

export const replaceFunction = (string, oldValue, newValue) => {
    return string.replaceAll(oldValue, newValue)
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

export const popUpShow = (element) => {
    element.classList.remove('popUp-hide')
    element.classList.add('popUp-show')
}

export const popUpHide = (element) => {
    element.classList.add('popUp-hide')
    element.classList.remove('popUp-show')
}

export const nightMode = () => {
    const nightModeType = localStorage.getItem('lightMode')

    if (nightModeType === 'true') {
        return 'lightGls'
    } else {
        return 'darkGls'
    }
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
    const monthsPast =  Math.floor(convertToMonth(currentUnixTime - publishUnixTime))
    const daysPast =  Math.floor(convertToDay(currentUnixTime - publishUnixTime))
    const hoursPast =  Math.floor(convertToHour(currentUnixTime - publishUnixTime))

    if (yearsPast >= 1) {
        return `${yearsPast} سال پیش`

    } else if (monthsPast >= 1){
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
    return window.navigator.userAgent.includes('Mobile')
}

export const isItIPad = () => {
    return window.navigator.userAgent.includes('iPad')
}