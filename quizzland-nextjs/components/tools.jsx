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
        <div className='tools container mx-auto px-20 flex flex-ai-c'>
            <div className='tools__sort'>
                <button onClick={showHideToolsSort} className={`tools__sort__btn btn`}>ترتیب بر اساس: 
                    <span>  {sortTypeDefinition[props.sortType]}  </span>
                </button>
                <div className={showToolsSort ? 'fadeIn' : 'fadeOut'}>
                    <ul className='tools__sort__options'>
                        <button onClick={() => {changeSortType('newest')}} className={`btn`} type='button'>جدیدترین</button>
                        <button onClick={() => {changeSortType('bestest')}} className={`btn`} type='button'>بهترین</button>
                        <button onClick={() => {changeSortType('alphabet')}} className={`btn`} type='button'>الفبا</button>
                    </ul>
                </div>
            </div>
            <div className='tools__numberOfResult'>
                <button onClick={showHideToolsNumberOfResult} className={`tools__numberOfResult__btn btn`}>تعداد نمایش: 
                    <span> {props.numberOfResult} </span>
                </button>
                <div className={showToolsNumberOfResults ? 'fadeIn' : 'fadeOut'}>
                    <ul className='tools__numberOfResult__options'>
                        <button onClick={() => {changeNumberOfResults(16)}} className={`btn`} type='button'>16</button>
                        <button onClick={() => {changeNumberOfResults(32)}} className={`btn`} type='button'>32</button>
                        <button onClick={() => {changeNumberOfResults(48)}} className={`btn`} type='button'>48</button>
                    </ul>
                </div>
            </div>
        </div>
    );
}
 
export default Tools;