import { isItDesktop } from './base'

const skeletonLoading = (contentLoaded) => {
    return (
        !(contentLoaded) &&
        <ul className={`flex flex-wrap flex-col md:flex-row`}>
            <li className='m-2 mb-5 overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            <li className='m-2 mb-5 overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            <li className='m-2 mb-5 overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            {
                (isItDesktop()) &&
                <>
                    <li className='m-2 mb-5 overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
                    <li className='m-2 mb-5 overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
                    <li className='m-2 mb-5 overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
                    <li className='m-2 mb-5 overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
                    <li className='m-2 mb-5 overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
                </>
            }
        </ul>
    );
}
 
export default skeletonLoading;