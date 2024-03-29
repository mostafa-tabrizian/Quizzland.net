import { useState, useEffect } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { getTheme } from '../base'

const Trivia = (props) => {
    const [theme , setTheme] = useState('dark')

    useEffect(() => {
        const theme = getTheme()
        setTheme(theme)
    }, []);
    
    if (props.question.option_1st) {
        return (
            <div className="flex justify-center">
                <form className='quiz__options w-[100%] md:grid md:grid-cols-2 space-y-3 justify-center' action="">
                    {props.question.option_1st !== ('') &&
                        <> <input
                            onClick={props.selectedOption}
                            type="radio"
                            name="answer" className='absolute opacity-0'
                            id={`${props.question.id}-1`}
                        />
                            <label
                                className={`quiz__options__textLabel backdrop-blur-xl pollAudience
                                        border border-[#ffffff30] ${theme == 'light' ? 'bg-[#ffffff78]' : 'bg-[#0000003c]'}
                                        p-2 block max-w-[100%] md:max-width-[14rem]
                                        md:h-[auto] md:pr-4 md:m-2 rounded-lg
                                        cursor-pointer
                                        hover:border-red-300
                                        ${props.correctAnswerOption === 1 ? 'quiz__correctAnswer' : ''}
                                        ${props.wrongAnswerOption === 1 ? 'quiz__wrongAnswer' : ''}
                                        ${!props.ableToSelectOption ? 'pointer-events-none' : ''}
                                    `}
                                id={`${props.question.id}-1`}
                                htmlFor={`${props.question.id}-1`}
                            >
                                {props.question.option_1st}
                            </label>
                        </>
                    }
                    {props.question.option_2nd !== ('') && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-2`} /> <label className={`quiz__options__textLabel backdrop-blur-xl pollAudience border border-[#ffffff30] ${theme == 'light' ? 'bg-[#ffffff78]' : 'bg-[#0000003c]'} hover:border-red-300 p-2 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-lg cursor-pointer ${props.correctAnswerOption === 2 ? 'quiz__correctAnswer' : ''} ${props.wrongAnswerOption === 2 ? 'quiz__wrongAnswer' : ''} ${!props.ableToSelectOption ? 'pointer-events-none' : ''}`} id={`${props.question.id}-2`} htmlFor={`${props.question.id}-2`}> {props.question.option_2nd} </label> </>}
                    {props.question.option_3rd !== ('') && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-3`} /> <label className={`quiz__options__textLabel backdrop-blur-xl pollAudience border border-[#ffffff30] ${theme == 'light' ? 'bg-[#ffffff78]' : 'bg-[#0000003c]'} hover:border-red-300 p-2 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-lg cursor-pointer ${props.correctAnswerOption === 3 ? 'quiz__correctAnswer' : ''} ${props.wrongAnswerOption === 3 ? 'quiz__wrongAnswer' : ''} ${!props.ableToSelectOption ? 'pointer-events-none' : ''}`} id={`${props.question.id}-3`} htmlFor={`${props.question.id}-3`}> {props.question.option_3rd} </label> </>}
                    {props.question.option_4th !== ('') && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-4`} /> <label className={`quiz__options__textLabel backdrop-blur-xl pollAudience border border-[#ffffff30] ${theme == 'light' ? 'bg-[#ffffff78]' : 'bg-[#0000003c]'} hover:border-red-300 p-2 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-lg cursor-pointer ${props.correctAnswerOption === 4 ? 'quiz__correctAnswer' : ''} ${props.wrongAnswerOption === 4 ? 'quiz__wrongAnswer' : ''} ${!props.ableToSelectOption ? 'pointer-events-none' : ''}`} id={`${props.question.id}-4`} htmlFor={`${props.question.id}-4`}> {props.question.option_4th} </label> </>}
                </form>
            </div>
        )
    } else {
        return (
            <div className="flex w-[22rem] md:w-[29rem] justify-center">
                <form className='relative grid flex-wrap justify-center grid-cols-2 pt-4 quiz_options' data={props.question.answer} action="">
                    {!(props.question.option_img_1st.includes('NotExist')) && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-1`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl ${props.correctAnswerOption === 1 ? 'quiz__correctAnswer' : ''} ${props.wrongAnswerOption === 1 ? 'quiz__wrongAnswer' : ''} ${!props.ableToSelectOption ? 'pointer-events-none' : ''}`} id={`${props.question.id}-1`} htmlFor={`${props.question.id}-1`}> <LazyLoadImage src={props.question.option_img_1st} alt={props.question.title} effect='blur' title={props.question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                    {!(props.question.option_img_2nd.includes('NotExist')) && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-2`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl ${props.correctAnswerOption === 2 ? 'quiz__correctAnswer' : ''} ${props.wrongAnswerOption === 2 ? 'quiz__wrongAnswer' : ''} ${!props.ableToSelectOption ? 'pointer-events-none' : ''}`} id={`${props.question.id}-2`} htmlFor={`${props.question.id}-2`}> <LazyLoadImage src={props.question.option_img_2nd} alt={props.question.title} effect='blur' title={props.question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                    {!(props.question.option_img_3rd.includes('NotExist')) && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-3`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl ${props.correctAnswerOption === 3 ? 'quiz__correctAnswer' : ''} ${props.wrongAnswerOption === 3 ? 'quiz__wrongAnswer' : ''} ${!props.ableToSelectOption ? 'pointer-events-none' : ''}`} id={`${props.question.id}-3`} htmlFor={`${props.question.id}-3`}> <LazyLoadImage src={props.question.option_img_3rd} alt={props.question.title} effect='blur' title={props.question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                    {!(props.question.option_img_4th.includes('NotExist')) && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-4`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl ${props.correctAnswerOption === 4 ? 'quiz__correctAnswer' : ''} ${props.wrongAnswerOption === 4 ? 'quiz__wrongAnswer' : ''} ${!props.ableToSelectOption ? 'pointer-events-none' : ''}`} id={`${props.question.id}-4`} htmlFor={`${props.question.id}-4`}> <LazyLoadImage src={props.question.option_img_4th} alt={props.question.title} effect='blur' title={props.question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                </form>
            </div>
        )
    }
}
 
export default Trivia;