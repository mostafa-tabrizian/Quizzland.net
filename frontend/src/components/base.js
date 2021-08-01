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