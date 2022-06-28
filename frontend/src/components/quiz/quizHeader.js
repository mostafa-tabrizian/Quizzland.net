import { makeDatePublishFormatForQuizDetail } from '../base'
import { Switch } from 'antd';

const QuizHeader = (props) => {
    return (
        <div className="relative text-right quiz__head backdrop-blur-2xl p-4 w-[21rem] transition-all duration-1000 mt-8 ease-in-out md:w-[33rem] left-1/2 translate-x-[-50%] bg-[#0000001a] rounded-xl" id="quiz__head">
            {
                !(props.contentLoaded) &&
                <div className='flex items-center justify-center'>
                    <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonLoading skeletonLoading__quizTitle'></div>
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
                        <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonLoading skeletonLoading__quizInfo'></div>
                        <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonLoading skeletonLoading__quizInfo'></div>
                    </div>
                }
                {
                    props.contentLoaded &&
                    <div className='flex space-x-6'>
                        <h5>{makeDatePublishFormatForQuizDetail(props.quizDetail?.publish)}</h5>
                        <h5>تعداد سوال ها: {props.questionsLength}</h5>
                    </div>
                }
            </div>

            {
                props.contentLoaded &&
                <div className='flex space-x-5 translate-x-[-3rem]'>
                    <div onClick={() => { props.setAutoQuestionChanger(props.autoQuestionChanger ? false : true) }} className={`quiz__autoQuestionChangerSwitch mt-5 hover:cursor-pointer relative center flex justify-center items-center`} title='با انتخاب گزینه، خودکار پس از 3.5 ثانیه به سوال بعدی منتقل می شوید'>
                        {/* <button className="quiz__autoQuestionChangerSwitch__btn btn">
                            <div className={`quiz__autoQuestionChangerSwitch__innerBtn ${autoQuestionChanger ? 'quiz__autoQuestionChangerSwitch__innerBtn__switched' : ''} relative`}></div>
                        </button> */}
                        <div className='mt-3'>
                            <Switch
                                checkedChildren='خودکار'
                                unCheckedChildren='دستی'
                                className={`${props.autoQuestionChanger ? 'bg-red-800' : 'bg-zinc-500'}`}
                                onChange={() => { props.setAutoQuestionChanger(props.autoQuestionChanger ? false : true) }}
                                title='تغییر سوال: با انتخاب گزینه، در صورت خودکار بودن، پس از حداقل 1.5 حداکثر 5.5 ثانیه به سوال بعدی منتقل می شوید'
                            />
                        </div>
                    </div>
                    <div onClick={() => { props.SFXController() }} className={`mt-5 hover:cursor-pointer relative center items-center`} title='فرض صدا های پس از پاسخ به سوال'>
                        <div className='mt-3'>
                            <Switch
                                checkedChildren='فرض صدا'
                                uncheckedChildren='فرض صدا'
                                className={`${localStorage.getItem('SFXAllowed') === 'true' ? 'bg-red-800' : 'bg-zinc-500'}`}
                                onChange={() => { props.SFXController() }}
                                title='فرض صدا های پس از پاسخ به سوال'
                            />
                        </div>
                    </div>
                </div>
            }

        </div>
    );
}
 
export default QuizHeader;