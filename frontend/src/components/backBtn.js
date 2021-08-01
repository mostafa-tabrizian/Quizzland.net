import React from 'react'

const BackBtn = () => {
    const goBack = () => {
        window.history.go(-2)
    } 

    return (
        <button onClick={goBack} type='button' className='backBtn btn'>بازگشت</button>
    );
}
 
export default BackBtn;

