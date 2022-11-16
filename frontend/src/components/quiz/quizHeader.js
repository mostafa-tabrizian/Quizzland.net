import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';

import { getTheme, log } from '../base'

const TestHeader = (props) => {
    return (
        <div className={`relative text-right quiz__head backdrop-blur-2xl p-4 w-[85%]
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

            <div className="flex justify-between">
                <div className='flex space-x-3'>
                    <button className='bg-[#00000073] rounded-full p-1' onClick={() => log('reported...')}>
                        <svg style={{'color': props.quizDetail?.theme}} class={`h-6 w-6 brightness-200`}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />  <line x1="4" y1="22" x2="4" y2="15" /></svg>
                    </button>
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
 
export default TestHeader;