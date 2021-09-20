const skeletonLoading = (contentLoaded) => {
    return (
        !(contentLoaded) && 
        <ul className={`quizContainer flex wrapper-med`}>
            <li className='skeletonLoading skeletonLoading__quizContainer'></li>
            <li className='skeletonLoading skeletonLoading__quizContainer'></li>
            <li className='skeletonLoading skeletonLoading__quizContainer'></li>
            <li className='skeletonLoading skeletonLoading__quizContainer'></li>
            <li className='skeletonLoading skeletonLoading__quizContainer'></li>
            <li className='skeletonLoading skeletonLoading__quizContainer'></li>
            <li className='skeletonLoading skeletonLoading__quizContainer'></li>
            <li className='skeletonLoading skeletonLoading__quizContainer'></li>
        </ul>
    );
}
 
export default skeletonLoading;