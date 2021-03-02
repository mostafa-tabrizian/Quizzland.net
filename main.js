const log = (code) => {
    console.log(code)
}

const categoryBtn = document.querySelector('.category-btn')
const category = document.querySelector('.category')
const arw = document.querySelector('.arw')
let categoryOpenClose = 'close'

categoryBtn.addEventListener('click', appearCategory)
function appearCategory() {
    if (categoryOpenClose == 'close') {
        category.style.cssText = 'opacity: 1; transition: all .3s; top: 10%;';
        arw.style.cssText = 'opacity: 1; transition: all .3s; top: 9%'
        categoryOpenClose = 'open'
    } else {
        category.style.cssText = 'opacity: 0; transition: all .3s; top: 11%';
        arw.style.cssText = 'opacity: 0; transition: all .3s; top: 10%'
        categoryOpenClose = 'close'
    }
}