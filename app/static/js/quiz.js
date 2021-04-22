// Grab the answers
const quizFinished = document.querySelector('.showResult')

let correct = 0
let wrong = 0

try {
    quizFinished.addEventListener('click', () => {
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
        // 3
        try {
            if (document.querySelector('#witcher3-q1-1').checked){correct += 1} else {wrong += 1}
            if (document.querySelector('#witcher3-q2-2').checked){correct += 1} else {wrong += 1}
            if (document.querySelector('#witcher3-q3-3').checked){correct += 1} else {wrong += 1}
            if (document.querySelector('#witcher3-q4-4').checked){correct += 1} else {wrong += 1}
        } catch(e) {}

        const score = (correct / (correct + wrong)) * 100
        localStorage.setItem('correctData', correct)
        localStorage.setItem('wrongData', wrong)
        localStorage.setItem('scoreData', score)
    })
} catch (er) {log('no quiz')}

const scoreData = localStorage.getItem('scoreData')
const correctData = localStorage.getItem('correctData')
const wrongData = localStorage.getItem('wrongData')
const result__score = document.querySelector('.result__score')
const result__subtitle__txt = document.querySelector('.result__subtitle__txt')
const result__detail__correctTime = document.querySelector('.result__detail__correctTime')
const result__detail__wrongTime = document.querySelector('.result__detail__wrongTime')

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