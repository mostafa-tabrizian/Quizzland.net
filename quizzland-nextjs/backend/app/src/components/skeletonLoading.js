const skeletonLoading = (contentLoaded) => {
    return (
        !(contentLoaded) && 
        <ul className={`quizContainer flex container mx-auto px-20`}>
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