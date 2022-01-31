const skeletonLoading = (contentLoaded) => {
    return (
        !(contentLoaded) &&
        <ul className={`quizContainer flex flex-wrap container m-4 md:px-20`}>
            <li className='skeletonLoading skeletonLoading__quizContainer mb-5 shadow-xl m-2 overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            <li className='skeletonLoading skeletonLoading__quizContainer mb-5 shadow-xl m-2 overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            <li className='skeletonLoading skeletonLoading__quizContainer mb-5 shadow-xl m-2 overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            <li className='skeletonLoading skeletonLoading__quizContainer mb-5 shadow-xl m-2 overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            <li className='skeletonLoading skeletonLoading__quizContainer mb-5 shadow-xl m-2 overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            <li className='skeletonLoading skeletonLoading__quizContainer mb-5 shadow-xl m-2 overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            <li className='skeletonLoading skeletonLoading__quizContainer mb-5 shadow-xl m-2 overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            <li className='skeletonLoading skeletonLoading__quizContainer mb-5 shadow-xl m-2 overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
        </ul>
    );
}
 
export default skeletonLoading;