import React, { useState, useEffect } from 'react';

import { log, getTheme, replaceFunction, keyPressedOnInput } from '../base'
import Search from './search'

const SearchInput = () => {
    const [contentLoaded, setContentLoaded] = useState(false)
    const [searchValue, setSearchValue] = useState()
    const [theme, setTheme] = useState('dark')
     
    useEffect(() => {
        const theme = getTheme()
        setTheme(theme)
    }, []);

    const inputChanged = (input) => {
        setSearchValue(input.target.value)
        document.querySelector('body').style = `background: ${theme == 'dark' ? '#060101' : 'white'}; overflow-y: hidden`
    }

    const closeSearch = () => {
        setContentLoaded(false) 
        document.querySelector('body').style = `background: ${theme == 'dark' ? '#060101' : 'white'}; overflow-y: auto`
    }
    
    return (
        <React.Fragment>
            <div className={`header__searched hidden md:flex items-center`}>
                <div className='relative'>
                    <input
                        type='text'
                        className='pl-4 pr-12 py-1 border border-[#8C939D] w-[20rem] rounded-full text-right bg-transparent text-[0.9rem] my-auto'
                        placeholder={`کوییزلند رو بگرد...`}
                        onChange={inputChanged}
                        onKeyPress={(e) => keyPressedOnInput(e)}
                    />
                    <svg className='absolute w-5 h-5 top-2 right-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">
                        <circle data-name="layer1" cx="24.2" cy="24.2" r="22.2" fill="none" stroke="#8C939D" stroke-miterlimit="10" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" />
                        <path data-name="layer1" fill="none" stroke="#8C939D" stroke-miterlimit="10" stroke-width="5" d="M39.9 39.9L62 62" stroke-linejoin="round" stroke-linecap="round" />
                    </svg>
                </div>

                <div class={`w-screen h-screen fixed left-0 top-[7rem] overflow-y-scroll ${theme == 'dark' ? 'bg-[#060101]' : 'bg-white'} ${contentLoaded ? 'fadeIn' : 'fadeOut'}`}>    
                    <button
                        className={`
                            fixed right-4 top-2
                        `}
                        onClick={closeSearch}
                    >

                        <svg className="w-6 h-6 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>

                    <Search value={searchValue} setContentLoaded={setContentLoaded} contentLength={32}/>
                </div>
            </div>

        </React.Fragment>
    )
}

export default SearchInput;