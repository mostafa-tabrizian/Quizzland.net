import React from 'react'
import { useRouter } from 'next/router'

const BackBtn = () => {
    const router = useRouter()
    const goBack = () => {
        try {
            router.back()
        } catch {}
    }

    return (
        <button onClick={goBack} type='button' className='backBtn btn'>بازگشت</button>
    );
}
 
export default BackBtn;

