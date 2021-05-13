// Grab the answers

let correct = 0
let wrong = 0

const calculateResult = () => {

    const titleOfQuiz = document.querySelector('quiz__head h3')
    const score = ((correct / (correct + wrong)) * 100).toFixed(0)
    localStorage.setItem('titleOfQuiz', titleOfQuiz)
    localStorage.setItem('correctData', correct)
    localStorage.setItem('wrongData', wrong)
    localStorage.setItem('scoreData', score)
}

const titleOfQuiz = localStorage.getItem('titleOfQuiz')
const scoreData = localStorage.getItem('scoreData')
const correctData = localStorage.getItem('correctData')
const wrongData = localStorage.getItem('wrongData')
const result__title = document.querySelector('.result__title')
const result__score = document.querySelector('.result__score')
const result__subtitle__txt = document.querySelector('.result__subtitle__txt')
const result__detail__correctTime = document.querySelector('.result__detail__correctTime')
const result__detail__wrongTime = document.querySelector('.result__detail__wrongTime')

try {
    result__title.innerHTML = `${titleOfQuiz} : نتیجه کویز`
    result__detail__correctTime.innerHTML = correctData
    result__detail__wrongTime.innerHTML = wrongData
    
    if (scoreData > 80){
        result__score.innerHTML = (`😎 ${scoreData}%`)
        result__subtitle__txt.innerHTML = ('! شما یک ویتچریه واقعی هستید')}
    else if (scoreData > 60){
        result__score.innerHTML = (`😀 ${scoreData}%`)
        result__subtitle__txt.innerHTML = ('شما 70% از بقیه‌ی فن ها جلوترید')}
    else if (scoreData > 40){
        result__score.innerHTML = (`🙂 ${scoreData}%`)
        result__subtitle__txt.innerHTML = ('بد نیست ولی میتونست بهتر هم باشه')}
    else if (scoreData > 20){
        result__score.innerHTML = (`🙄 ${scoreData}%`)
        result__subtitle__txt.innerHTML = ('نیاز به بیشتر شناختش داری')}
    else if (scoreData >= 0){
        result__score.innerHTML = (`😭 ${scoreData}%`)
        result__subtitle__txt.innerHTML = ('😅 عیبی نداره کسی نمیفهمه، میتونی دوباره کویز رو بدی ')}

} catch (e) {
    log('no result page')
} 

log('quiz.js working')