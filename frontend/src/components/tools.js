import { useState } from 'react'

import { log } from './base'

const Tools = (props) => {
    return (
        <div className='grid grid-cols-3 w-[22rem] mx-auto my-12 justify-center'>
            <h3 className={`${props.sortType == 'trend' ? 'bloodRiver_bg' : 'hover:text-red-200'} py-1 text-center rounded`}><button onClick={() => { props.setSortType('trend') }} type='button'>محبوب‌ ترین</button></h3>
            <h3 className={`${props.sortType == 'views' ? 'bloodRiver_bg' : 'hover:text-red-200'} py-1 text-center rounded`}><button onClick={() => { props.setSortType('views') }} type='button'>پربازدیدترین</button></h3>
            <h3 className={`${props.sortType == 'newest' ? 'bloodRiver_bg' : 'hover:text-red-200'} py-1 text-center rounded`}><button onClick={() => { props.setSortType('newest') }} type='button'>جدیدترین</button></h3>
        </div>
    );
}

export default Tools;