import { LazyLoadImage } from 'react-lazy-load-image-component';

const Test = (props) => {
    if (props.question.option_1st) {
        return (
            <div className="flex justify-center">
                <form className='quiz__options w-[100%] md:grid md:grid-cols-2 space-y-3 justify-center' action="">
                    {props.question.option_1st !== ('') && <> <input onClick={props.selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${props.question.id}-1`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${props.question.id}-1`} htmlFor={`${props.question.id}-1`}> {props.question.option_1st} </label> </>}
                    {props.question.option_2nd !== ('') && <> <input onClick={props.selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${props.question.id}-2`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${props.question.id}-2`} htmlFor={`${props.question.id}-2`}> {props.question.option_2nd} </label> </>}
                    {props.question.option_3rd !== ('') && <> <input onClick={props.selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${props.question.id}-3`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${props.question.id}-3`} htmlFor={`${props.question.id}-3`}> {props.question.option_3rd} </label> </>}
                    {props.question.option_4th !== ('') && <> <input onClick={props.selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${props.question.id}-4`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${props.question.id}-4`} htmlFor={`${props.question.id}-4`}> {props.question.option_4th} </label> </>}
                    {props.question.option_5th !== ('') && <> <input onClick={props.selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${props.question.id}-5`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${props.question.id}-5`} htmlFor={`${props.question.id}-5`}> {props.question.option_5th} </label> </>}
                    {props.question.option_6th !== ('') && <> <input onClick={props.selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${props.question.id}-6`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${props.question.id}-6`} htmlFor={`${props.question.id}-6`}> {props.question.option_6th} </label> </>}
                    {props.question.option_7th !== ('') && <> <input onClick={props.selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${props.question.id}-7`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${props.question.id}-7`} htmlFor={`${props.question.id}-7`}> {props.question.option_7th} </label> </>}
                    {props.question.option_8th !== ('') && <> <input onClick={props.selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${props.question.id}-8`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${props.question.id}-8`} htmlFor={`${props.question.id}-8`}> {props.question.option_8th} </label> </>}
                    {props.question.option_9th !== ('') && <> <input onClick={props.selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${props.question.id}-9`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${props.question.id}-9`} htmlFor={`${props.question.id}-9`}> {props.question.option_9th} </label> </>}
                    {props.question.option_10th !== ('') && <> <input onClick={props.selectedOption} className='absolute opacity-0' type="radio" name="answer" id={`${props.question.id}-10`} /> <label className={`quiz__options__textLabel bg-[#0000003c] backdrop-blur-xl border-2 border-solid border-[#adadad] p-1 block max-w-[100%] md:max-width-[14rem] md:h-[auto] md:pr-4 md:m-2 rounded-xl cursor-pointer`} id={`inputLabel ${props.question.id}-10`} htmlFor={`${props.question.id}-10`}> {props.question.option_10th} </label> </>}
                </form>
            </div>
        )
    } else {
        return (
            <div className="flex justify-center">
                <form className='relative grid flex-wrap justify-center grid-cols-2 pt-4 quiz_options md:flex md:space-x-3' data={props.question.answer} action="">
                    {!(props.question.option_img_1st?.includes('NotExist')) && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-1`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${props.question.id}-1`} htmlFor={`${props.question.id}-1`}> <LazyLoadImage src={props.question.option_img_1st} width='512' height='624' alt={props.question.title} title={props.question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                    {!(props.question.option_img_2nd?.includes('NotExist')) && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-2`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${props.question.id}-2`} htmlFor={`${props.question.id}-2`}> <LazyLoadImage src={props.question.option_img_2st} width='512' height='624' alt={props.question.title} title={props.question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                    {!(props.question.option_img_3rd?.includes('NotExist')) && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-3`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${props.question.id}-3`} htmlFor={`${props.question.id}-3`}> <LazyLoadImage src={props.question.option_img_3rd} width='512' height='624' alt={props.question.title} title={props.question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                    {!(props.question.option_img_4th?.includes('NotExist')) && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-4`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${props.question.id}-4`} htmlFor={`${props.question.id}-4`}> <LazyLoadImage src={props.question.option_img_4th} width='512' height='624' alt={props.question.title} title={props.question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                    {!(props.question.option_img_5th?.includes('NotExist')) && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-5`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${props.question.id}-5`} htmlFor={`${props.question.id}-5`}> <LazyLoadImage src={props.question.option_img_5th} width='512' height='624' alt={props.question.title} title={props.question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                    {!(props.question.option_img_6th?.includes('NotExist')) && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-6`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${props.question.id}-6`} htmlFor={`${props.question.id}-6`}> <LazyLoadImage src={props.question.option_img_6th} width='512' height='624' alt={props.question.title} title={props.question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                    {!(props.question.option_img_7th?.includes('NotExist')) && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-7`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${props.question.id}-7`} htmlFor={`${props.question.id}-7`}> <LazyLoadImage src={props.question.option_img_7th} width='512' height='624' alt={props.question.title} title={props.question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                    {!(props.question.option_img_8th?.includes('NotExist')) && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-8`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${props.question.id}-8`} htmlFor={`${props.question.id}-8`}> <LazyLoadImage src={props.question.option_img_8th} width='512' height='624' alt={props.question.title} title={props.question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                    {!(props.question.option_img_9th?.includes('NotExist')) && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-9`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${props.question.id}-9`} htmlFor={`${props.question.id}-9`}> <LazyLoadImage src={props.question.option_img_9th} width='512' height='624' alt={props.question.title} title={props.question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                    {!(props.question.option_img_10th?.includes('NotExist')) && <> <input onClick={props.selectedOption} type="radio" name="answer" className='absolute opacity-0' id={`${props.question.id}-10`} /> <label className={`w-32 md:w-40 m-1.5 h-[9.6rem] md:h-[12rem] border-2 border-zinc-500 rounded-xl `} id={`inputLabel ${props.question.id}-10`} htmlFor={`${props.question.id}-10`}> <LazyLoadImage src={props.question.option_img_10th} width='512' height='624' alt={props.question.title} title={props.question.title} className="object-contain object-top quiz__imgOption rounded-xl" /> </label> </>}
                </form>
            </div>
        )
    }
}
 
export default Test;