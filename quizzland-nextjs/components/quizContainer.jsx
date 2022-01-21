import {useEffect, useState} from 'react'
import Image from 'next/image'

import { log, replaceFunction, datePublishHandler, viewsFormat} from './base'

const QuizContainerWithoutViews = (props) => {
    return (
        props.quizzes.map((quiz) => {
            return (
                <li key={quiz.id} className='mr-2 ml-2 md:mb-6'>
                    <article className={`
                        flex tx-al-r
                        ${props.bgStyle == 'bg' ? 'quizContainer__bg' : 'quizContainer__trans'}`}
                    >  {/* bg or trans */}

                        <a href={`/quiz/${replaceFunction(quiz.title, ' ', '-')}`}
                            className='grid grid-cols-5 md:block'
                        >
                            <div className='col-span-2'>
                                <Image
                                    src={quiz.thumbnail}
                                    width='224'
                                    height='126'
                                    alt={`${quiz.subCategory} | ${quiz.title}`}
                                    blurDataURL={quiz.thumbnail}
                                    placeholder='blur'
                                    className='rounded-r-xl md:rounded-xl'
                                />
                            </div>
                            <div className='col-span-3'>
                                <h2 className={`quizContainer__title quizContainer__title__noViews flex
                                                text-sm mr-5 md:w-52 md:mr-0 md:text-base`}>
                                    {quiz.subCategory}
                                </h2>
                                <h2 className={`quizContainer__title quizContainer__title__noViews flex
                                                text-sm mr-5 md:w-52 md:mr-0 md:text-base`}>
                                    {quiz.title}
                                </h2>
                                {/* <div className="quizContainer__views">{viewsFormat(quiz.views * 10)}</div> */}
                                {/* <span className="quizContainer__date tx-al-c">
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
