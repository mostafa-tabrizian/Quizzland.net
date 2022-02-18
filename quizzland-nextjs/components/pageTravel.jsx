import { useState } from 'react'

import { log } from './base'

const PageTravel = (props) => {

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    }

    const goNextPage = () => {
        props.setOffset(props.offset + props.numberOfResult)
        props.setCurrentPageNumber(prev => prev + 1)
        scrollToTop()
    }

    const goDoubleNextPage = () => {
        if (props.offset === 0) {
            props.setOffset(props.numberOfResult * 2)
        } else {
            props.setOffset(props.numberOfResult * 2 + props.offset)
        }

        props.setCurrentPageNumber(prev => prev + 2)
        scrollToTop()
    }

    const goPreviousPage = () => {
        props.setOffset(props.offset - props.numberOfResult)
        props.setCurrentPageNumber(prev => prev - 1)
        scrollToTop()
    }

    const goLastPage = () => {
        if (props.pageTravel != '') {
            const totalDataCount = props.pageTravel.count
            const resultToShow = props.numberOfResult
            props.setOffset(totalDataCount - totalDataCount % resultToShow)
            props.setCurrentPageNumber(Math.ceil(totalDataCount / resultToShow))
            scrollToTop()
        }
    }

    const whatIsTheLastPageNumber = () => {
        if (props.pageTravel != '') {
            const totalDataCount = props.pageTravel.count
            const resultToShow = props.numberOfResult
            return Math.ceil(totalDataCount / resultToShow)
        }
    }

    const thereIsEnoughDataToDoubleNext = () => {
        if (props.pageTravel != '') {
            const totalDataCount = props.pageTravel.count
            const offset = props.offset
            const resultToShow = props.numberOfResult
            if (offset + (resultToShow * 2) < totalDataCount) {
                return true
            } else {
                return false
            }
        }
    }

    return (
        <div className={`pageTravel flex justify-center flex-ai-c space-med`}>

            {
                props.pageTravel.previous &&
                <button className='pageTravel__arwLast' onClick={goPreviousPage}>
                    <svg className="w-6 h-6 text-white"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="5" y1="12" x2="19" y2="12" />  <line x1="15" y1="16" x2="19" y2="12" />  <line x1="15" y1="8" x2="19" y2="12" /></svg>
                </button>
            }
            
            <div className='flex justify-center pageTravel__pages flex-ai-c'>
                {props.pageTravel.previous && <button onClick={goPreviousPage}>{props.currentPageNumber - 1}</button>}
                <span className='pageTravel__pages__curr'>{props.currentPageNumber}</span>
                {props.pageTravel.next && <button onClick={goNextPage}>{props.currentPageNumber + 1}</button>}
                {thereIsEnoughDataToDoubleNext() && <button onClick={goDoubleNextPage}>{props.currentPageNumber + 2}</button>}
                {thereIsEnoughDataToDoubleNext() && '....'}
                {thereIsEnoughDataToDoubleNext() && <button onClick={goLastPage}>{whatIsTheLastPageNumber()}</button>}
            </div>
            {
                props.pageTravel.next &&
                <button className='pageTravel__arwNext' onClick={goNextPage}>
                    <svg className="w-6 h-6 text-white"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="5" y1="12" x2="19" y2="12" />  <line x1="15" y1="16" x2="19" y2="12" />  <line x1="15" y1="8" x2="19" y2="12" /></svg>
                </button>
            }
        </div>
    );
}
 
export default PageTravel;