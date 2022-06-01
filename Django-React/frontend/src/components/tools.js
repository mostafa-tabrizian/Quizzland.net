import { useState } from 'react'

import { log, nightMode } from './base'

const Tools = (props) => {
    const [showToolsSort, setShowToolsSort] = useState(false)
    const [showToolsNumberOfResults, setShowToolsNumberOfResults] = useState(false)

    const sortTypeDefinition = {
        'newest': 'جدیدترین',
        'views': 'پربازدیدترین',
        'monthlyViews': 'محبوب ترین',
        'alphabet': 'ترتیب الفبا',

        'جدیدترین': 'newest',
        'پربازدیدترین': 'views',
        'محبوب ترین': 'monthlyViews',
        'ترتیب الفبا': 'alphabet'
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
        props.setCountResult(number)
        showHideToolsNumberOfResult()
    }

    return (
        <div className='tools container justify-center md:justify-end flex relative mt-5 text-lg space-x-2'>
            <div className='tools__numberOfResult'>
                <button onClick={showHideToolsNumberOfResult} className={`tools__numberOfResult__btn w-full tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`}>تعداد نمایش:
                    <span> {props.countResult} </span>
                </button>
                <div className={` ${showToolsNumberOfResults ? 'fadeIn' : 'fadeOut'} my-2`}>
                    <ul className='tools__numberOfResult__options space-x-1 space-x-reverse'>
                        <button onClick={() => { changeNumberOfResults(16) }} className={`tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`} type='button'>16</button>
                        <button onClick={() => { changeNumberOfResults(32) }} className={`tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`} type='button'>32</button>
                        <button onClick={() => { changeNumberOfResults(48) }} className={`tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`} type='button'>48</button>
                    </ul>
                </div>
            </div>
            <div>
                <button onClick={showHideToolsSort} className={`bg-gray-300 text-black tools_btn px-2 py-1 w-full rounded-lg`}>ترتیب بر اساس:
                    <span>  {sortTypeDefinition[props.sortType]}  </span>
                </button>
                <div className={`${showToolsSort ? 'fadeIn' : 'fadeOut'} my-2`}>
                    <ul className='space-x-1 space-x-reverse'>
                        <button onClick={() => { changeSortType('newest') }} className={`tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`} type='button'>جدیدترین</button>
                        <button onClick={() => { changeSortType('views') }} className={`tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`} type='button'>پربازدیدترین</button>
                        <button onClick={() => { changeSortType('monthlyViews') }} className={`tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`} type='button'>محبوب‌ ترین</button>
                        <button onClick={() => { changeSortType('alphabet') }} className={`tools_btn px-2 py-1 rounded-lg bg-gray-300 text-black`} type='button'>حروف الفبا</button>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Tools;