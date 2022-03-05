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
            loadingScreen fixed left-0
            top-0 w-screen h-screen z-20
            flex items-center justify-center
            ${hideLoadingScreen}
        `}>
        </div>
    )
}
 
export default LoadingScreen;