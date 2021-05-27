// Grab the answers

// add value to correct question


const typeOfQuiz = localStorage.getItem('OR4XAZKPMZIXK2L2')

if (quiz__container__eachOne) {
    if (typeOfQuiz == 'quiz') {
        encodedNumbers = {
            1: 'b25l',
            2: 'dHdv',
            3: 'dGhyZWU=',
            4: 'Zm91cg=='
        }
        quiz__container__eachOne.forEach(each => {
            const answerData = each.getAttribute('data')
            each[answerData - 1].value = 'Y29ycmVjdA=='
            encodedAnswer = (encodedNumbers[answerData])
            each.setAttribute('data', encodedAnswer)
        })
        
        let correct = 0
        let wrong = 0
    
        const scoreDATA = localStorage.getItem('ONRW64TF')
        const correctAnswerCounterDATA = localStorage.getItem('MNXXE4TFMN2EC3TTO5SXEQ3POVXHIZLS')
        const wrongAnswerCounterDATA = localStorage.getItem('O5ZG63THIFXHG53FOJBW65LOORSXE===')

        if (result__detail__correctTime) {
            result__detail__correctTime.innerHTML = correctAnswerCounterDATA
            result__detail__wrongTime.innerHTML = wrongAnswerCounterDATA
            
            if (scoreDATA > 80){
                result__score.innerHTML = (`😎 ${scoreDATA}%`)
                result__subtitle.innerHTML = (`! شما یک ${ fanName } واقعی هستید`)}
            else if (scoreDATA > 60){
                result__score.innerHTML = (`😀 ${scoreDATA}%`)
                result__subtitle.innerHTML = ('شما 70% از بقیه‌ی فن ها جلوترید')}
            else if (scoreDATA > 40){
                result__score.innerHTML = (`🙂 ${scoreDATA}%`)
                result__subtitle.innerHTML = ('بد نیست ولی میتونست بهتر هم باشه')}
            else if (scoreDATA > 20){
                result__score.innerHTML = (`🙄 ${scoreDATA}%`)
                result__subtitle.innerHTML = ('نیاز به بیشتر شناختش داری')}
            else if (scoreDATA >= 0){
                result__score.innerHTML = (`😭 ${scoreDATA}%`)
                result__subtitle.innerHTML = ('😅 عیبی نداره کسی نمیفهمه، میتونی دوباره کوئیز رو بدی ')}
        } else { log('no result page') } 
    }
} else { log('no quiz.js') }

const calculateResult = (FinalTitleOfQuiz) => {
    let quizUrl = decodeURIComponent(window.location.href)
    const correctAnswerCounter = document.querySelectorAll(".quiz__container div form input[value='Y29ycmVjdA==']:checked").length
    const questionCounter = quiz__container.length
    const wrongAnswerCounter = questionCounter - correctAnswerCounter
    const score = ((correctAnswerCounter / (correctAnswerCounter + wrongAnswerCounter)) * 100).toFixed(0)
    try {
        localStorage.setItem('OF2WS6SVOJWA====', quizUrl)
        localStorage.setItem('MNXXE4TFMN2EC3TTO5SXEQ3POVXHIZLS', correctAnswerCounter)
        localStorage.setItem('O5ZG63THIFXHG53FOJBW65LOORSXE===', wrongAnswerCounter)
        localStorage.setItem('ONRW64TF', score)
    } catch {
        alert('لطفا کوکی و ذخیره محلی خود را فعال کنید | Please enable your Cookies and LocalStorage')
    }

    window.location.replace(`/result/${FinalTitleOfQuiz}`); 
}

const calculateResult_4Option = (FinalTitleOfQuiz) => {
    let quizUrl = decodeURIComponent(window.location.href)
    try {
        localStorage.setItem('OF2WS6SVOJWA====', quizUrl)
    } catch {
        alert('لطفا کوکی و ذخیره محلی خود را فعال کنید | Please enable your Cookies and LocalStorage')
    }

    let score = 0
    const correctAnswerCounter = document.querySelectorAll(".quiz__container div form input:checked")
    correctAnswerCounter.forEach(each => {
        pointOfThisAnswer = parseInt(each.getAttribute('data'))
        log(pointOfThisAnswer)
        score += pointOfThisAnswer
    })
    window.location.replace(`/result_2/${FinalTitleOfQuiz}/${score}`); 
}

log('quiz.js working ________________________________________________')