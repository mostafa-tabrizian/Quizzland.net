import { useState } from 'react'

import { log } from './base'

const Tools = (props) => {
    return (
        <div className='flex space-x-12 md:space-x-24 mb-10 justify-center'>
            <h3 className={`title text-xl ${props.sortType == 'monthlyViews' ? 'bloodRiver' : 'hover:text-red-200'}`}><button onClick={() => { props.setSortType('monthlyViews') }} type='button'>محبوب‌ ترین</button></h3>
            <h3 className={`title text-xl ${props.sortType == 'views' ? 'bloodRiver' : 'hover:text-red-200'}`}><button onClick={() => { props.setSortType('views') }} type='button'>پربازدیدترین</button></h3>
            <h3 className={`title text-xl ${props.sortType == 'newest' ? 'bloodRiver' : 'hover:text-red-200'}`}><button onClick={() => { props.setSortType('newest') }} type='button'>جدیدترین</button></h3>
        </div>
    );
}

export default Tools;