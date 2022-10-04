import React, { useState, useEffect } from 'react';

import { log, keyPressedOnInput } from '../base'
import Search from './search'

const SearchInput = () => {
    return (
        <React.Fragment>
            <div className={`header__searched hidden md:flex items-center`}>
                <div className={`relative rounded-full z-10`}>
                    <input
                        type='text'
                        className='pl-4 pr-12 py-1 border border-[#8C939D] w-[20rem] rounded-full text-right bg-transparent text-[0.9rem] my-auto'
                        placeholder={`کوییزلند رو بگرد...`}
                        onKeyPress={(e) => keyPressedOnInput(e)}
                    />
                    <svg className='absolute w-5 h-5 top-2 right-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">
                        <circle data-name="layer1" cx="24.2" cy="24.2" r="22.2" fill="none" stroke="#8C939D" stroke-miterlimit="10" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" />
                        <path data-name="layer1" fill="none" stroke="#8C939D" stroke-miterlimit="10" stroke-width="5" d="M39.9 39.9L62 62" stroke-linejoin="round" stroke-linecap="round" />
                    </svg>
                </div>
            </div>

        </React.Fragment>
    )
}

export default SearchInput;