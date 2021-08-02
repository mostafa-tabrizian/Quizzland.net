import { useState } from 'react'

import { log, nightMode } from './base'

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
        <div className='tools wrapper-med flex flex-ai-c'>
            <div className='tools__sort'>
                <button onClick={showHideToolsSort} className={`tools__sort__btn btn ${nightMode()}`}>ترتیب بر اساس: 
                    <span>  {sortTypeDefinition[props.sortType]}  </span>
                </button>
                <div className={showToolsSort ? 'fadeIn' : 'fadeOut'}>
                    <ul className='tools__sort__options'>
                        <button onClick={() => {changeSortType('newest')}} className={`btn ${nightMode()}`} type='button'>جدیدترین</button>
                        <button onClick={() => {changeSortType('bestest')}} className={`btn ${nightMode()}`} type='button'>بهترین</button>
                        <button onClick={() => {changeSortType('alphabet')}} className={`btn ${nightMode()}`} type='button'>الفبا</button>
                    </ul>
                </div>
            </div>
            <div className='tools__numberOfResult'>
                <button onClick={showHideToolsNumberOfResult} className={`tools__numberOfResult__btn ${nightMode()} btn`}>تعداد نمایش: 
                    <span> {props.numberOfResult} </span>
                </button>
                <div className={showToolsNumberOfResults ? 'fadeIn' : 'fadeOut'}>
                    <ul className='tools__numberOfResult__options'>
                        <button onClick={() => {changeNumberOfResults(16)}} className={`${nightMode()} btn`} type='button'>16</button>
                        <button onClick={() => {changeNumberOfResults(32)}} className={`${nightMode()} btn`} type='button'>32</button>
                        <button onClick={() => {changeNumberOfResults(48)}} className={`${nightMode()} btn`} type='button'>48</button>
                    </ul>
                </div>
            </div>
        </div>
    );
}
 
export default Tools;