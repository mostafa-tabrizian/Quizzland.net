import { isItDesktop } from './base'

const skeletonQuiz = (contentLoaded) => {
    return (
        !(contentLoaded) &&
        <ul className="flex flex-wrap align-baseline">
            <li className='relative flex-auto w-full mx-2 mb-5 overflow-hidden shadow-xl md:w-[15rem] md:mr-4 rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl skeletonQuiz skeletonQuiz__quizContainer'></li>
            <li className='relative flex-auto w-full mx-2 mb-5 overflow-hidden shadow-xl md:w-[15rem] md:mr-4 rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl skeletonQuiz skeletonQuiz__quizContainer'></li>
            <li className='relative flex-auto w-full mx-2 mb-5 overflow-hidden shadow-xl md:w-[15rem] md:mr-4 rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl skeletonQuiz skeletonQuiz__quizContainer'></li>
            <li className='relative flex-auto w-full mx-2 mb-5 overflow-hidden shadow-xl md:w-[15rem] md:mr-4 rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl skeletonQuiz skeletonQuiz__quizContainer'></li>
            {
                (isItDesktop()) &&
                <>
                    <li className='relative flex-auto w-full mx-2 mb-5 overflow-hidden shadow-xl md:w-[15rem] md:mr-4 rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl skeletonQuiz skeletonQuiz__quizContainer'></li>
                    <li className='relative flex-auto w-full mx-2 mb-5 overflow-hidden shadow-xl md:w-[15rem] md:mr-4 rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl skeletonQuiz skeletonQuiz__quizContainer'></li>
                    <li className='relative flex-auto w-full mx-2 mb-5 overflow-hidden shadow-xl md:w-[15rem] md:mr-4 rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl skeletonQuiz skeletonQuiz__quizContainer'></li>
                    <li className='relative flex-auto w-full mx-2 mb-5 overflow-hidden shadow-xl md:w-[15rem] md:mr-4 rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl skeletonQuiz skeletonQuiz__quizContainer'></li>
                </>
            }
        </ul>
    );
}
 
export default skeletonQuiz;