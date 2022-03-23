import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { log, replaceFunction, viewsFormat, datePublishHandler } from './base'

const QuizContainer = (props) => {
    return (
        props.quizzes.map((quiz) => {
            return (
                <li key={quiz.id} className='mr-5 mb-4 md:mb-7 md:mt-5'>
                <article className={`
                    flex text-right h-full
                    rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                `}>

                    <Link
                        to={`/test/${replaceFunction(quiz.title, ' ', '-')}`}
                        className='flex md:block md:grid-cols-5'
                    >
                        <div className='md:col-span-2 w-[360px] md:w-[260px] h-[120px] md:h-[150px] overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl'>
                            <img
                                src={quiz.thumbnail}
                                width={1366}
                                height={768}
                                alt={`${quiz.subCategory} | ${quiz.title}`}
                                className=' h-full max-w-fit '
                            />
                        </div>
                        <div className='w-full pt-1 pb-3 pr-4 md:pr-0 md:col-span-3 md:mt-2'>
                            <h2 className={`quizContainer__title quizContainer__title__noViews flex m-auto md:m-0
                                            text-sm md:w-52 md:text-base`}>
                                {quiz.subCategory}
                            </h2>
                            <h3 className={`
                                quizContainer__title quizContainer__title__noViews flex
                                text-sm w-[10rem] md:w-52 md:text-base
                            `}>
                                {quiz.title}
                            </h3>
                            {/* <div className="quizContainer__views">{viewsFormat(quiz.views * 10)}</div> */}
                            {/* <span className="text-center quizContainer__date">
                                {datePublishHandler(quiz.publish)}
                            </span> */}
                        </div>
                    </Link>
                </article>
            </li>
            )
        })
    )
}
 
export default QuizContainer;