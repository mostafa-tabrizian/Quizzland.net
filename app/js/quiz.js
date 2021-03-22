// GSAP
gsap.registerPlugin(ScrollTrigger)


// Counting left
const height = document.body.clientHeight;
const heightFooter = (document.querySelector('footer').offsetTop) - 780;
log(heightFooter)

gsap.to('.quiz__leftCounter', {
    scrollTrigger: {
        trigger: '.quiz__questions',
        markers: true,
        start: 'top top',
        end: heightFooter,
        scrub: 1,
    },
    width: '100%',
})

// Grab the answers
const quizFinished = document.querySelector('.showResult')

quizFinished.addEventListener('click', () => {
    let score = 0;

    // Witcher
    // 1
    try {
        if (document.querySelector('#witcher1-q1-1').checked){score += 10}
        if (document.querySelector('#witcher1-q2-2').checked){score += 10}
        if (document.querySelector('#witcher1-q3-3').checked){score += 10}
        if (document.querySelector('#witcher1-q4-4').checked){score += 10}
    }  catch(e) {}
    // 2
    try {
        if (document.querySelector('#witcher2-q1-1').checked){score += 10}
        if (document.querySelector('#witcher2-q2-2').checked){score += 10}
        if (document.querySelector('#witcher2-q3-3').checked){score += 10}
        if (document.querySelector('#witcher2-q4-4').checked){score += 10}
    } catch(e) {}
    // 3
    try {
        if (document.querySelector('#witcher3-q1-1').checked){score += 10}
        if (document.querySelector('#witcher3-q2-2').checked){score += 10}
        if (document.querySelector('#witcher3-q3-3').checked){score += 10}
        if (document.querySelector('#witcher3-q4-4').checked){score += 10}
    } catch(e) {}

    log(`Your Score: ${score}`)

})



