import { useState } from 'react'

import { log } from './base'

const Tools = (props) => {
    const [showToolsSort, setShowToolsSort] = useState(false)
    const [showToolsNumberOfResults, setShowToolsNumberOfResults] = useState(false)

    const sortTypeDefinition = {
        'newest': 'جدیدترین',
        'bestest': 'بهترین',
        'alphabet': 'الفبا',
        'جدیدترین': 'newest',
        'بهترین': 'bestest',
        'الفبا': 'alphabet'
    }

    const showHideToolsSort = () => {
        setShowToolsSort(showToolsSort ? false : true)
    }

    const showHideToolsNumberOfResult = () => {
        setShowToolsNumberOfResults(showToolsNumberOfResults ? false : true)
    }

    const changeSortType = (type) => {
        props.setSortType(type)
        showHideToolsSort()
    }

    const changeNumberOfResults = (number) => {
        props.setNumberOfResult(number)
        showHideToolsNumberOfResult()
    }

    return (
        <div className='tools container justify-center md:justify-end mx-auto md:px-20 flex relative mt-5 text-lg z-10 space-x-2'>
            <div className='tools__numberOfResult'>
                <button onClick={showHideToolsNumberOfResult} className={`tools__numberOfResult__btn w-full tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`}>تعداد نمایش: 
                    <span> {props.numberOfResult} </span>
                </button>
                <div className={` ${showToolsNumberOfResults ? 'fadeIn' : 'fadeOut'} my-2`}>
                    <ul className='tools__numberOfResult__options space-x-1 space-x-reverse'>
                        <button onClick={() => {changeNumberOfResults(16)}} className={`tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`} type='button'>16</button>
                        <button onClick={() => {changeNumberOfResults(32)}} className={`tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`} type='button'>32</button>
                        <button onClick={() => {changeNumberOfResults(48)}} className={`tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`} type='button'>48</button>
                    </ul>
                </div>
            </div>
            <div>
                <button onClick={showHideToolsSort} className={`bg-gray-300 text-black tools_btn px-2 py-1 w-full rounded-lg`}>ترتیب بر اساس: 
                    <span>  {sortTypeDefinition[props.sortType]}  </span>
                </button>
                <div className={`${showToolsSort ? 'fadeIn' : 'fadeOut'} my-2`}>
                    <ul className='space-x-1 space-x-reverse'>
                        <button onClick={() => {changeSortType('newest')}} className={`tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`} type='button'>جدیدترین</button>
                        <button onClick={() => {changeSortType('bestest')}} className={`tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`} type='button'>بهترین</button>
                        <button onClick={() => {changeSortType('alphabet')}} className={`tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`} type='button'>الفبا</button>
                    </ul>
                </div>
            </div>
        </div>
    );
}
 
export default Tools;