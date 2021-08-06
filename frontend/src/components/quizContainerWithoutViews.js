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

    const datePublishHandler = (publishFullDate) => {
        if (publishFullDate) {
            const publishDay = parseInt(publishFullDate.slice(8, 10))
            const publishMonth = parseInt(publishFullDate.slice(5, 7))
            const publishYear = parseInt(publishFullDate.slice(1, 4)) + 2000

            const currentDay = new Date().getDay() + 1
            const currentMonth = new Date().getMonth() + 1
            const currentYear = new Date().getFullYear()

            if (currentYear > publishYear) {
                const totalYearsAfterPublishingTheQuiz = currentYear - publishYear
                return `${totalYearsAfterPublishingTheQuiz} سال پیش`
            } else if (currentMonth > publishMonth){
                const totalMonthsAfterPublishingTheQuiz = currentMonth - publishMonth
                return `${totalMonthsAfterPublishingTheQuiz} ماه پیش`
            } else if (currentDay > publishDay) {
                const totalDaysAfterPublishingTheQuiz = currentDay - publishDay
                return `${totalDaysAfterPublishingTheQuiz} روز پیش`
            }
        }
        return publishFullDate
    }

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
                                <div className="quizContainer__date">{datePublishHandler(quiz.publish)}</div>
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
