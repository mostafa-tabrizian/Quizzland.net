import { useState, useCallback, useRef } from 'react'
import debounce from 'lodash.debounce'
import axiosInstance from '../axiosAuthApi';

import { useSnackbar } from 'notistack'
import Tooltip from '@mui/material/Tooltip';

import { getTheme, log } from '../base'
import UserStore from '../../store/userStore';

const QuizHeader = (props) => {
    const [reportPanel, setReportPanel] = useState(false)

    const title = useRef()
    const description = useRef()

    const [userProfile, userActions] = UserStore()

    const { enqueueSnackbar } = useSnackbar()

    const sendReport = useCallback(
        debounce(
            async () => {
                const payload = {
                    question_id: props.questionCurrent,
                    title: title.current.value,
                    description: description.current.value,
                    type: 'quiz'
                }

                await axiosInstance.post('/api/send_report', payload)
                    .then(res => {
                        setReportPanel(false)
                        enqueueSnackbar('گزارش شما با موفقیت ثبت شد. ', { variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
                        setTimeout(() => {
                            title.current.value = ''
                            description.current.value = ''
                        }, 1000);
                    })
                    .catch(err => {
                        log(err)
                        log(err.response)
                    })
            }
        )
    )

    const openReportPanel = () => {
        if (userProfile.userDetail) {
            setReportPanel(true)
        } else {
            enqueueSnackbar('شما میبایست ابتدا وارد شوید.', { variant: 'warning', anchorOrigin: { horizontal: 'right', vertical: 'top' }})
        }
    }

    return (
        <div className={`relative text-right quiz__head backdrop-blur-2xl p-4 w-[85%] z-10
            transition-all duration-1000 mt-8 ease-in-out md:w-[29rem] left-1/2 translate-x-[-50%]
            ${getTheme() == 'light' ? 'bg-[#ffffff82]' : 'bg-[#0000001a]'} rounded-xl`}
            id="quiz__head"
        >
            {
                !(props.contentLoaded) &&
                <div className='flex items-center justify-center'>
                    <div className='m-2 mb-5 overflow-hidden rounded-lg shadow-xl skeletonQuiz skeletonQuiz__quizTitle'></div>
                </div>
            }
            
            <div style={{background: props.quizDetail?.theme}} className={`${reportPanel ? 'pop_up opacity-100' : 'pop_down opacity-0'} rounded-lg z-10 shadow-[0_0_25px_7px_black] w-full p-3 rounded-t-lg-800 fixed top-0 left-0
            `}>
                <div className='relative space-y-3'>
                    <input className='w-full rounded blackText pr-2' ref={title} placeholder='عنوان گزارش' type="text" />
                    <textarea className='w-full rounded blackText pr-2 pt-2' ref={description} placeholder='توضیحات' rows="11"></textarea>
                    <div className='flex space-x-4'>
                        <button onClick={sendReport} className='border-2 border-green-600 rounded px-2 py-1'>ثبت</button>
                        <button onClick={() => setReportPanel(false)}>لغو</button>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <div className='flex space-x-3'>
                    <Tooltip componentsProps={{tooltip:{sx:{backgroundColor: props.quizDetail?.theme}}}} title="ثبت گزارش">
                        <button className='bg-[#00000073] rounded-full p-1' onClick={openReportPanel}>
                            <svg style={{'color': props.quizDetail?.theme}} class={`h-6 w-6 brightness-200`}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />  <line x1="4" y1="22" x2="4" y2="15" /></svg>
                        </button>
                    </Tooltip>
                    <Tooltip componentsProps={{tooltip:{sx:{backgroundColor: props.quizDetail?.theme}}}} title="فرض صدا پس از پاسخ به هر سوال">
                        <button className='bg-[#00000073] rounded-full p-1' onClick={() => props.SFXController(props.SFXAllowed ? false : true)}>
                            {
                                props.SFXAllowed ?
                                <svg style={{'color': props.quizDetail?.theme}} class={`h-7 w-7 brightness-200`}  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                                </svg>
                                :
                                <svg style={{'color': props.quizDetail?.theme}} class={`h-7 w-7 brightness-200`}  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
                                </svg>
                            }
                        </button>
                    </Tooltip>
                </div>
                <h1 className='md:max-w-[21rem] max-w-[19rem]'>
                    کوییز {props.quizDetail?.title}
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
            </div>

            {/* {
                props.contentLoaded &&
                <div className='flex translate-x-[-3rem]'>
                    <Tooltip title="فرض صدا های پس از پاسخ به سوال">
                        <div
                            onClick={() => { props.SFXController(props.SFXAllowed ? false : true) }}
                            className={`mt-5 hover:cursor-pointer relative center items-center`}
                        >
                            <div className='mt-3'>
                                <FormControlLabel
                                    value="authQuestionChanger"
                                    control={
                                        <Switch
                                            checked={props.SFXAllowed ? true : false}
                                            onChange={() => { props.SFXController(props.SFXAllowed ? false : true) }}
                                        />
                                    }
                                    label="صدا"
                                    labelPlacement="start"
                                />
                            </div>
                        </div>
                    </Tooltip>
                </div>
            } */}

        </div>
    );
}
 
export default QuizHeader;