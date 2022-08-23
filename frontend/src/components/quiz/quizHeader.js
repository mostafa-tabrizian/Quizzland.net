import { Switch } from 'antd';
import persianJs from "persianjs"

import { makeDatePublishFormatForQuizDetail, getTheme, log } from '../base'

const QuizHeader = (props) => {
    return (
        <div className={`relative text-right quiz__head backdrop-blur-2xl p-4 w-[21rem]
            transition-all duration-1000 mt-8 ease-in-out md:w-[33rem] left-1/2 translate-x-[-50%]
            ${getTheme() == 'dark' ? 'bg-[#0000001a]' : 'bg-[#ffffff82]'} rounded-xl`}
            id="quiz__head"
        >
            {
                !(props.contentLoaded) &&
                <div className='flex items-center justify-center'>
                    <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonQuiz skeletonQuiz__quizTitle'></div>
                </div>
            }

            <div className="flex justify-center mb-4 text-center">
                <h1 className='md:max-w-[21rem] max-w-[19rem]'>
                    {props.quizDetail?.title}
                </h1>
            </div>

            <div className="flex items-center justify-center quiz__detail">
                {
                    !(props.contentLoaded) &&
                    <div className='flex space-x-5'>
                        <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonQuiz skeletonQuiz__quizInfo'></div>
                        <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonQuiz skeletonQuiz__quizInfo'></div>
                    </div>
                }
                {
                    props.contentLoaded &&
                    <div className='flex space-x-6'>
                        <h5>{makeDatePublishFormatForQuizDetail(props.quizDetail?.publish)}</h5>
                        <h5>تعداد سوال ها: {persianJs(props.questionsLength).englishNumber()._str}</h5>
                    </div>
                }
            </div>

            {
                props.contentLoaded &&
                <div className='flex space-x-8 translate-x-[-3rem]'>
                    <div onClick={() => { props.changeAutoQuestionChanger(props.autoQuestionChanger ? false : true) }} className={`quiz__autoQuestionChangerSwitch mt-5 hover:cursor-pointer relative center flex justify-center items-center`} title='با انتخاب گزینه، خودکار پس از 3.5 ثانیه به سوال بعدی منتقل می شوید'>
                        <div className='mt-3'>
                            <Switch
                                checkedChildren='تغییر خودکار'
                                unCheckedChildren='تغییر دستی'
                                className={`${props.autoQuestionChanger ? 'bg-red-800' : 'bg-zinc-500'}`}
                                onChange={() => { props.changeAutoQuestionChanger(props.autoQuestionChanger ? false : true) }}
                                title='در صورت خودکار بودن، پس از 1.5 الی 5.5 ثانیه برحسب نوع سوال، به سوال بعدی منتقل می شوید'
                                checked={props.autoQuestionChanger ? true : false}
                            />
                        </div>
                    </div>
                    <div onClick={() => { props.SFXController(props.SFXAllowed ? false : true) }} className={`mt-5 hover:cursor-pointer relative center items-center`} title='فرض صدا های پس از پاسخ به سوال'>
                        <div className='mt-3'>
                            <Switch
                                checkedChildren='افکت فعال'
                                unCheckedChildren='افکت غیرفعال'
                                className={`${props.SFXAllowed ? 'bg-red-800' : 'bg-zinc-500'}`}
                                onChange={() => { props.SFXController(props.SFXAllowed ? false : true) }}
                                title='فرض افکت پس از پاسخ به سوال'
                                checked={props.SFXAllowed ? true : false}
                            />
                        </div>
                    </div>
                </div>
            }

        </div>
    );
}
 
export default QuizHeader;