const skeletonLoading = (contentLoaded) => {
    return (
        <ul className={`quizContainer flex wrapper-med ${contentLoaded ? 'noVis' : ''}`}>
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