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

export const isItDesktop = () => {
    return window.navigator.userAgent.includes('Windows')
}

export const isItMobile = () => {
    return window.navigator.userAgent.includes('Mobile')
}

export const isItIPad = () => {
    return window.navigator.userAgent.includes('iPad')
}