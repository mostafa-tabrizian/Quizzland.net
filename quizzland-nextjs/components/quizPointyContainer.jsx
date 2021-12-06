import { useEffect, useState } from 'react'
import Image from 'next/image'

import { log, replaceFunction, viewsFormat, datePublishHandler } from '../components/base'

const QuizContainer = (props) => {
    return (
        props.quizzes.map((quiz) => {
            return (
                <li key={quiz.id}>
                    <article className={`flex tx-al-r ${props.bgStyle == 'bg' ? 'quizContainer__bg' : 'quizContainer__trans'}`}>
                        <a href={`/test/${replaceFunction(quiz.title, ' ', '-')}`}>
                            <div>
                                <Image
                                    src={quiz.thumbnail}
                                    blurDataURL={quiz.thumbnail}
                                    width='224'
                                    height='126'
                                    alt={`${quiz.subCategory} | ${quiz.title}`}
                                    placeholder='blur'
                                />                            </div>
                            <div className="quizContainer__views">{viewsFormat(quiz.views * 10)}</div>
                            {/* <div className="quizContainer__date tx-al-c">{datePublishHandler(quiz.publish)}</div> */}
                            <span className="quizContainer__title quizContainer__title__noViews flex">
                                { quiz.title }
                            </span>
                        </a>
                    </article>
                </li>
            )
        })
    )
}
 
export default QuizContainer;