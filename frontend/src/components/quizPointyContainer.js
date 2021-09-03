import { useEffect, useState } from 'react'

import { log, replaceFunction, viewsFormat, datePublishHandler } from './base'

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
            log(replaceFunction(quiz.title, ' ', '-'))
            return (
                <li key={quiz.id}>
                    <article className={`flex tx-al-r ${bgStyle}`}>
                        <a href={`/test/${replaceFunction(quiz.title, ' ', '-')}`}>
                            <div>
                                <img src={`${quiz.thumbnail}`} alt={`${quiz.subCategory}} | ${quiz.title}`} loading='lazy' />
                            </div>
                            {/* <div className="quizContainer__views">{viewsFormat(quiz.views)}</div> */}
                            <div className="quizContainer__date tx-al-c">{datePublishHandler(quiz.publish)}</div>
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