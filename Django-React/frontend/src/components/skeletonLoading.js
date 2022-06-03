import { isItDesktop } from './base'

const skeletonLoading = (contentLoaded) => {
    return (
        !(contentLoaded) &&
        <ul className="mx-auto flex flex-wrap align-baseline w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto quizContainer flex-ai-fe justify-right">
            <li className='md:mr-5 md:mb-5 mb-5 flex-auto overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            <li className='md:mr-5 md:mb-5 mb-5 flex-auto overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            <li className='md:mr-5 md:mb-5 mb-5 flex-auto overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            <li className='md:mr-5 md:mb-5 mb-5 flex-auto overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            <li className='md:mr-5 md:mb-5 mb-5 flex-auto overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
            {
                (isItDesktop()) &&
                <>
                    <li className='md:mr-5 md:mb-5 mb-5 flex-auto overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
                    <li className='md:mr-5 md:mb-5 mb-5 flex-auto overflow-hidden shadow-xl skeletonLoading skeletonLoading__quizContainer rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'></li>
                </>
            }
        </ul>
    );
}
 
export default skeletonLoading;