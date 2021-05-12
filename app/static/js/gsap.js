// GSAP
try {
    gsap.registerPlugin(ScrollTrigger)

    // hide the ad when reach the footer
    gsap.to('.ad__r', {
        scrollTrigger: {
            trigger: 'footer',
            markers: false,
            start: '5% 100%',
            scrub: .1,
        },
        x: '200%',
        opacity: '0',
    })

    // Counting left
    log(heightFooter)

    gsap.to('.quiz__leftCounter', {
        scrollTrigger: {
            trigger: '.quiz__questions',
            markers: false,
            start: 'top top',
            end: heightFooter,
            scrub: 1,
        },
        width: '100%',
    })
} catch (e) {log('no gsap')}

// hero animation
tl = gsap.timeline({defaults: { ease: "power2.inOut", duration: 1 }})
tl.from('.hero-inner', {y: '20%', opacity: 0, backdropFilter: 'blur(0px)',})
// tl.from('header', {y: '-100%'}, '-=.7')

log('Script Working.')