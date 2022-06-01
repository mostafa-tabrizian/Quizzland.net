import { useState } from 'react'

import { log, nightMode } from './base'

const PageTravel = (props) => {
    const [currentPageNumber, setCurrentPageNumber] = useState(1)

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    }

    const goNextPage = () => {
        props.setOffset(props.offset + props.numberResult)
        setCurrentPageNumber(prev => prev + 1)
        scrollToTop()
    }

    const goDoubleNextPage = () => {
        if (props.offset === 0) {
            props.setOffset(props.numberResult * 2)
        } else {
            props.setOffset(props.numberResult * 2 + props.offset)
        }

        setCurrentPageNumber(prev => prev + 2)
        scrollToTop()
    }

    const goPreviousPage = () => {
        props.setOffset(props.offset - props.numberResult)
        setCurrentPageNumber(prev => prev - 1)
        scrollToTop()
    }

    const goLastPage = () => {
        if (props.pageTravel != '') {
            const totalDataCount = props.pageTravel.count
            const resultToShow = props.numberResult
            props.setOffset(totalDataCount - totalDataCount % resultToShow)
            setCurrentPageNumber(Math.ceil(totalDataCount / resultToShow))
            scrollToTop()
        }
    }

    const whatIsTheLastPageNumber = () => {
        if (props.pageTravel != '') {
            const totalDataCount = props.pageTravel.count
            const resultToShow = props.numberResult
            return Math.ceil(totalDataCount / resultToShow)
        }
    }

    const thereIsEnoughDataToDoubleNext = () => {
        if (props.pageTravel != '') {
            const totalDataCount = props.pageTravel.count
            const offset = props.offset
            const resultToShow = props.numberResult
            if (offset + (resultToShow * 2) < totalDataCount) {
                return true
            } else {
                return false
            }
        }
    }

    return (
        <div className={`pageTravel ${nightMode()} flex justify-center items-center space-med`}>
            {props.pageTravel.previous && <button className='pageTravel__arwLast' onClick={goPreviousPage}></button>}
            <div className='pageTravel__pages flex justify-center items-center'>
                {props.pageTravel.previous && <button onClick={goPreviousPage}>{currentPageNumber - 1}</button>}
                <span className='pageTravel__pages__curr'>{currentPageNumber}</span>
                {props.pageTravel.next && <button onClick={goNextPage}>{currentPageNumber + 1}</button>}
                {thereIsEnoughDataToDoubleNext() && <button onClick={goDoubleNextPage}>{currentPageNumber + 2}</button>}
                {thereIsEnoughDataToDoubleNext() && '....'}
                {thereIsEnoughDataToDoubleNext() && <button onClick={goLastPage}>{whatIsTheLastPageNumber()}</button>}
            </div>
            {props.pageTravel.next && <button className='pageTravel__arwNext' onClick={goNextPage}></button>}
        </div>
    );
}

export default PageTravel;