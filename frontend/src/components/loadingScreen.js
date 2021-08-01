import React, { useState, useEffect } from 'react'

import { log } from './base'

const LoadingScreen = () => {
    const [hideLoadingScreen, setHideLoadingScreen] = useState('fadeIn')

    useEffect(() => {
            setHideLoadingScreen('fadeOut')
            setTimeout(() => {
                setHideLoadingScreen('noVis')
            }, 540)
    }, [])

    return (
        <div className={`loadingScreen pos-fix flex flex-jc-c flex-ai-c ${hideLoadingScreen}`}></div>
    )
}
 
export default LoadingScreen;