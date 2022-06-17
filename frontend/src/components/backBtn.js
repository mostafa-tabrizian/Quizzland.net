import React from 'react'

const BackBtn = () => {
    const goBack = () => {
        window.history.go(-2)
    } 

    return (
        <button onClick={goBack} type='button' className='backBtn bg-zinc-500 rounded-lg px-5'>بازگشت</button>
    );
}
 
export default BackBtn;

