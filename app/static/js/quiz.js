// Grab the answers
// const quizFinished = document.querySelector('.showResult')

let correct = 0
let wrong = 0

// const quiz__nextQuestion = document.querySelector('.quiz__nextQuestion')

const calculateResult = () => {

    // Witcher
    // 1
    try {
        if (document.querySelector('#witcher1-q1-1').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#witcher1-q2-2').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#witcher1-q3-3').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#witcher1-q4-4').checked){correct += 1} else {wrong += 1}
    }  catch(e) {}
    // 2
    try {
        if (document.querySelector('#witcher2-q1-1').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#witcher2-q2-2').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#witcher2-q3-3').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#witcher2-q4-4').checked){correct += 1} else {wrong += 1}
    } catch(e) {}

    // Celebrities
    // Taylor Swift
    try {
        if (document.querySelector('#ts1-q1-1').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#ts1-q2-2').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#ts1-q3-3').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#ts1-q4-2').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#ts1-q5-3').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#ts1-q6-1').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#ts1-q7-3').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#ts1-q8-3').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#ts1-q9-2').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#ts1-q10-2').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#ts1-q11-1').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#ts1-q12-2').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#ts1-q13-2').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#ts1-q14-3').checked){correct += 1} else {wrong += 1}
        if (document.querySelector('#ts1-q15-4').checked){correct += 1} else {wrong += 1}
    }  catch(e) {}

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