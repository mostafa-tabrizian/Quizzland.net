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

export const nightMode = () => {
    const nightModeType = localStorage.getItem('lightMode')

    if (nightModeType === 'true') {
        return 'lightGls'
    } else {
        return 'darkGls'
    }
}

export const datePublishHandler = (publishFullDate) => {
    if (publishFullDate) {
        const publishHour = parseInt(publishFullDate.slice(11, 13))
        const publishDay = parseInt(publishFullDate.slice(8, 10))
        const publishMonth = parseInt(publishFullDate.slice(5, 7))
        const publishYear = parseInt(publishFullDate.slice(0, 4))

        const currentHour = new Date().getHours()
        const currentDay = new Date().getDate()
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()

        if (currentYear > publishYear) {
            const totalYearsAfterPublishingTheQuiz = currentYear - publishYear
            return `${totalYearsAfterPublishingTheQuiz} سال پیش`
        } else if (currentMonth > publishMonth){
            const totalMonthsAfterPublishingTheQuiz = currentMonth - publishMonth
            return `${totalMonthsAfterPublishingTheQuiz} ماه پیش`
        } else if (currentDay > publishDay) {
            const totalDaysAfterPublishingTheQuiz = currentDay - publishDay
            return `${totalDaysAfterPublishingTheQuiz} روز پیش`
        } else {
            const totalHoursAfterPublishingTheQuiz = currentHour - publishHour
            if (totalHoursAfterPublishingTheQuiz === 0) {
                return 'چند دقیقه پیش'
            } else {
                return `${totalHoursAfterPublishingTheQuiz} ساعت پیش`
            }
        }
    }
    return publishFullDate
}