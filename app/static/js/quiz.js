// Grab the answers

// add value to correct question
quiz__container__eachOne.forEach(each => {
    log(each)
    const answerIsOption = each.getAttribute('data') - 1
    each[answerIsOption].value = 'Y29ycmVjdA=='
    log(each[answerIsOption])
})

let correct = 0
let wrong = 0

const calculateResult = () => {
    const correctAnswerCounter = document.querySelectorAll(".quiz__container div form input[value='Y29ycmVjdA==']:checked").length
    const questionCounter = quiz__container.length
    const wrongAnswerCounter = questionCounter - correctAnswerCounter
    const score = ((correctAnswerCounter / (correctAnswerCounter + wrongAnswerCounter)) * 100).toFixed(0)

    localStorage.setItem('correctAnswerCounter', correctAnswerCounter)
    localStorage.setItem('wrongAnswerCounter', wrongAnswerCounter)
    localStorage.setItem('score', score)
}

const scoreDATA = localStorage.getItem('score')
const correctAnswerCounterDATA = localStorage.getItem('correctAnswerCounter')
const wrongAnswerCounterDATA = localStorage.getItem('wrongAnswerCounter')

try {
    result__detail__correctTime.innerHTML = correctAnswerCounterDATA
    result__detail__wrongTime.innerHTML = wrongAnswerCounterDATA
    
    if (scoreDATA > 80){
        result__score.innerHTML = (`😎 ${scoreDATA}%`)
        result__subtitle__txt.innerHTML = ('! شما یک ویتچریه واقعی هستید')}
    else if (scoreDATA > 60){
        result__score.innerHTML = (`😀 ${scoreDATA}%`)
        result__subtitle__txt.innerHTML = ('شما 70% از بقیه‌ی فن ها جلوترید')}
    else if (scoreDATA > 40){
        result__score.innerHTML = (`🙂 ${scoreDATA}%`)
        result__subtitle__txt.innerHTML = ('بد نیست ولی میتونست بهتر هم باشه')}
    else if (scoreDATA > 20){
        result__score.innerHTML = (`🙄 ${scoreDATA}%`)
        result__subtitle__txt.innerHTML = ('نیاز به بیشتر شناختش داری')}
    else if (scoreDATA >= 0){
        result__score.innerHTML = (`😭 ${scoreDATA}%`)
        result__subtitle__txt.innerHTML = ('😅 عیبی نداره کسی نمیفهمه، میتونی دوباره کویز رو بدی ')}

} catch (e) {
    log('no result page')
} 

log('quiz.js working')