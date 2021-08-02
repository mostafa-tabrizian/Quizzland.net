import {useEffect, useState} from 'react'

import { log, replaceFunction } from './base'

const QuizContainerWithoutViews = (props) => {
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

    try {
        return (
            props.quizzes.map((quiz) => {
                return (
                    <li key={quiz.id}>
                        <article className={`flex tx-al-r ${bgStyle}`}>
                            <a href={`/quiz/${replaceFunction(quiz.title, ' ', '-')}`}>
                                <div>
                                    <img src={quiz.thumbnail} alt={`${quiz.subCategory} | ${quiz.title}`} loading='lazy' />
                                </div>
                                <div className="quizContainer__date">{replaceFunction(quiz.publish.slice(0, 10), '-', '/')}</div>
                                <span className="quizContainer__title quizContainer__title__noViews flex">
                                    {quiz.title}
                                </span>
                            </a>
                        </article>
                    </li>
                )
            })
        )
    } catch {
        log('no QuizContainer')
        return ''
    }
}
 
export default QuizContainerWithoutViews;
