import { useEffect, useState } from 'react'

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

    let quizCounter = 0

    return (
        props.quizzes.map((quiz) => {
            quizCounter += 1

            if (quizCounter == 1) {
                return (
                    <React.Fragment>
                        {/* Adverts */}
                        {
                            !(isItMobile()) &&
                            <div className='adverts_center' id='mediaad-WSYR'></div>
                        }
        
                        {
                            isItMobile() &&
                            <div className='adverts_center' id='mediaad-KlKX'></div>
                        }
                    </React.Fragment>
                )
            }
            else {
                return (
                    <li key={quiz.id}>
                        <article className={`flex tx-al-r ${bgStyle}`}>
                            <a href={`/quiz/${replaceFunction(quiz.title, ' ', '-')}`}>
                                <div>
                                    <img src={`${quiz.thumbnail}`} alt={`${quiz.subCategory} | ${quiz.title}`} loading='lazy' />
                                </div>
                                {/* <div className="quizContainer__views">{viewsFormat(quiz.views)}</div> */}
                                <span className="quizContainer__date tx-al-c">
                                    {datePublishHandler(quiz.publish)}
                                </span>
                                <h2 className="quizContainer__title quizContainer__title__noViews flex">
                                    { quiz.title }
                                </h2>
                            </a>
                        </article>
                    </li>
                )
            }
        })
    )
}
 
export default QuizContainer;