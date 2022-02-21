import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { log, replaceFunction, viewsFormat, datePublishHandler, isItMobile } from './base'

const QuizContainer = (props) => {
    const [bgStyle, setBgStyle] = useState()

    useEffect(() => {
        switch (props.bgStyle){
            case 'bg':
                setBgStyle('quizContainer__bg')
                break
            case 'trans':
                setBgStyle('quizContainer__trans')
                break
            default:
                break
        }
    }, [])

    return (
        props.quizzes.map((quiz) => {
        return (
            <li key={quiz.id} className='ml-1 mr-7 md:m-2 mb-4 md:mb-6'>
                <article className={`
                    flex text-right h-full
                    rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                    ${bgStyle == 'bg' ? 'quizContainer__bg' : 'quizContainer__trans'}`}
                >  {/* bg or trans */}

                    <Link
                        to={`/quiz/${replaceFunction(quiz.title, ' ', '-')}`}
                        className='flex md:block md:grid-cols-5'
                    >
                        <div className='md:col-span-2 w-[224px] md:h-[126px]'>
                            <img
                                src={quiz.thumbnail}
                                width={1366}
                                height={768}
                                alt={`${quiz.subCategory} | ${quiz.title}`}
                                className='rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'
                            />
                        </div>
                        <div className='w-full pt-1 pb-3 pr-1 md:col-span-3 md:mt-2'>
                            <h2 className={`quizContainer__title quizContainer__title__noViews flex
                                            text-sm mr-5 md:w-52 md:mr-0 md:text-base`}>
                                {quiz.subCategory}
                            </h2>
                            <h2 className={`
                                quizContainer__title quizContainer__title__noViews flex
                                text-sm mr-5 md:w-52 md:mr-0 md:text-base
                            `}>
                                {quiz.title}
                            </h2>
                            {/* <div className="quizContainer__views">{viewsFormat(quiz.views * 10)}</div> */}
                            {/* <span className="text-center quizContainer__date">
                                {datePublishHandler(quiz.publish)}
                            </span> */}
                        </div>
                    </Link>
                </article>
            </li>
        )
    }))
}
 
export default QuizContainer;