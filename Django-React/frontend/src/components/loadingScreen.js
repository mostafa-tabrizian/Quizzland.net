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
        <div className={`loadingScreen pos-fix flex flex-jc-c flex-ai-c ${hideLoadingScreen}`}></div>
    )
}
 
export default LoadingScreen;