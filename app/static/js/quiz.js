// Grab the answers

// add value to correct question

const typeOfQuiz = localStorage.getItem('typeOfQuiz')

try {
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
    
        const scoreDATA = localStorage.getItem('score')
        const correctAnswerCounterDATA = localStorage.getItem('correctAnswerCounter')
        const wrongAnswerCounterDATA = localStorage.getItem('wrongAnswerCounter')
    
        try {
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
    
        } catch (e) {
            log('no result page')
        } 
    }
} catch (e) {log('no quiz.js', e)}

const calculateResult = (FinalTitleOfQuiz) => {
    let quizUrl = decodeURIComponent(window.location.href)
    const correctAnswerCounter = document.querySelectorAll(".quiz__container div form input[value='Y29ycmVjdA==']:checked").length
    const questionCounter = quiz__container.length
    const wrongAnswerCounter = questionCounter - correctAnswerCounter
    const score = ((correctAnswerCounter / (correctAnswerCounter + wrongAnswerCounter)) * 100).toFixed(0)

    localStorage.setItem('quizUrl', quizUrl)
    localStorage.setItem('correctAnswerCounter', correctAnswerCounter)
    localStorage.setItem('wrongAnswerCounter', wrongAnswerCounter)
    localStorage.setItem('score', score)

    window.location.replace(`/result/${FinalTitleOfQuiz}`); 
}

const calculateResult_4Option = (FinalTitleOfQuiz) => {
    let quizUrl = decodeURIComponent(window.location.href)
    localStorage.setItem('quizUrl', quizUrl)

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