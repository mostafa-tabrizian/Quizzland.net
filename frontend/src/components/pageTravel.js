import { useState } from 'react'

import { log, nightMode} from './base'

const PageTravel = (props) => {
    const [currentPageNumber, setCurrentPageNumber] = useState(1)

    const goNextPage = () => {
        props.setOffset(props.offset + props.numberOfResult)
        setCurrentPageNumber(prev => prev + 1)
    }

    const goDoubleNextPage = () => {
        props.setOffset((props.offset * 2) + props.numberOfResult)
        setCurrentPageNumber(prev => prev + 2)
    }

    const goPreviousPage = () => {
        props.setOffset(props.offset - props.numberOfResult)
        setCurrentPageNumber(prev => prev - 1)
    }

    return (
        <div className={`pageTravel ${nightMode()} flex flex-jc-c flex-ai-c space-med`}>
            {props.pageTravel.previous && <button className='pageTravel__arwLast' onClick={goPreviousPage}></button>}
            <div className='pageTravel__pages flex flex-jc-c flex-ai-c'>
                {props.pageTravel.previous && <button onClick={goPreviousPage}>{currentPageNumber - 1}</button>}
                <span className='pageTravel__pages__curr'>{currentPageNumber}</span>
                {props.pageTravel.next && <button onClick={goNextPage}>{currentPageNumber + 1}</button>}
                {props.pageTravel.next && <button onClick={goDoubleNextPage}>{currentPageNumber + 2}</button>}
            </div>
            {props.pageTravel.next && <button className='pageTravel__arwNext' onClick={goNextPage}></button>}
        </div>
    );
}
 
export default PageTravel;