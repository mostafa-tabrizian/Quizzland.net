import { Link } from 'react-router-dom'
import { log, replaceFunction } from './base'

const QuizIndex = (props) => {
    try {
        return (
            props.quizzes.map((quiz) => {
                return <li key={quiz.id}>
                            <Link to={`/quiz/${replaceFunction(quiz.title, ' ', '-')}`}>
                                { quiz.title }
                            </Link>
                       </li>
            })
        );
    } catch {
        log('no QuizIndex')
        return ''
    }
}
 
export default QuizIndex;