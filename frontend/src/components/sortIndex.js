import { log, fadeIn, fadeOut } from './base'

const SortIndex = () => {

    const sort__all = document.querySelector('.sort__all')
    const sort__celebrities = document.querySelector('.sort__celebrities')
    const sort__movieAndSeries = document.querySelector('.sort__movieAndSeries')
    const sort__psychology = document.querySelector('.sort__psychology')

    const findTheSortByBtnName = {
        'روانشناسی 🧠': sort__psychology,
        'فیلم و سریال 🎬': sort__movieAndSeries,
        'سلبریتی ✨': sort__celebrities,
        'همه': sort__all,
    }

    const sort__controller = document.querySelector('.sort__controller')
    const sort__controller__btn = document.querySelectorAll('.sort__controller__btn')
    const numberOfControllerBtn = sort__controller__btn.length
    let lastBtnThatClicked = sort__controller__btn[numberOfControllerBtn - 1]
    let lastElementThatWereShown = document.querySelector('.sort__all')

    const disableTheSortController = () => {
        sort__controller.classList.add('pointerOff')
    }
    
    const freeTheSortController = () => {
        sort__controller.classList.remove('pointerOff')
    }

    sort__controller__btn.forEach(sortControllerBtn => {
        sortControllerBtn.addEventListener('click', () => {
            disableTheSortController()
    
            const sortElement = findTheSortByBtnName[sortControllerBtn.innerHTML]
            if (sortElement.classList.contains('fadeOut')) {
                fadeOut(lastElementThatWereShown)
                lastBtnThatClicked.classList.remove('sort__controller__selected')
                sortControllerBtn.classList.add('sort__controller__selected')
                setTimeout(() => {
                    fadeIn(sortElement)
                }, 500)
                lastElementThatWereShown = sortElement
                lastBtnThatClicked = sortControllerBtn
            }
            setTimeout(() => {
                freeTheSortController()
            }, 600)
        })
    })

    return (
        <div className="sort__controller pos-rel flex flex-jc-c" id="sort">
            <ul>
                <button className='sort__controller__btn btn' type="button" aria-label="Psychology Category">روانشناسی 🧠</button>
                <button className='sort__controller__btn btn' type="button" aria-label="Movie And Series Category">فیلم و سریال 🎬</button>
                <button className='sort__controller__btn btn' type="button" aria-label="Celebrity Category">سلبریتی ✨</button>
                <button className='sort__controller__btn btn sort__controller__selected' type="button">همه</button>
            </ul>
            <p className="pointerOff">برای تغییر کلیک کنید</p>
        </div> 
    );
}
 
export default SortIndex;