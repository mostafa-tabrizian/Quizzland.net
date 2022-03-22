import React, { useState, useEffect } from 'react'

import { log } from './base'

const LoadingScreen = () => {
    const [hideLoadingScreen, setHideLoadingScreen] = useState('fadeIn')
    const [showLoadingInDom, setShowLoadingInDom] = useState(true)

    useEffect(() => {
            setHideLoadingScreen('fadeOut')
            setTimeout(() => {
                setShowLoadingInDom(false)
            }, 540)
    }, [])

    return (
        showLoadingInDom &&
        <div className={`
            fixed left-0 backdrop-blur-3xl backdrop-brightness-75
            top-0 w-screen h-screen z-20 ${hideLoadingScreen}
            flex items-center justify-center
        `}>
            <div>
                <svg class="animate-spin h-10 w-10 m-10 text-red-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>    
            </div>
        </div>
    )
}
 
export default LoadingScreen;