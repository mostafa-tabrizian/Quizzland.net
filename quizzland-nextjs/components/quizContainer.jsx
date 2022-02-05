import {useEffect, useState} from 'react'
import Image from 'next/image'

import { log, replaceFunction, datePublishHandler, viewsFormat} from './base'

const QuizContainerWithoutViews = (props) => {
    return (
        props.quizzes.map((quiz) => {
            return (
                <li key={quiz.id} className='ml-1 mr-7 md:m-2 md:mb-6'>
                    <article className={`
                        flex text-right h-full
                        rounded-l-xl md:rounded-r-none md:rounded-tr-xl md:rounded-bl-xl
                        ${props.bgStyle == 'bg' ? 'quizContainer__bg' : 'quizContainer__trans'}`}
                    >  {/* bg or trans */}

                        <a href={`/quiz/${replaceFunction(quiz.title, ' ', '-')}`}
                            className='flex md:block md:grid-cols-5'
                        >
                            <div className='md:col-span-2 w-[224px] md:h-[126px]'>
                                <Image
                                    src={quiz.thumbnail}
                                    width='1366'
                                    height='768'
                                    alt={`${quiz.subCategory} | ${quiz.title}`}
                                    blurDataURL={quiz.thumbnail}
                                    placeholder='blur'
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
                        </a>
                    </article>
                </li>
            )
        })
    )
}
 
export default QuizContainerWithoutViews;
