import { useState, useEffect } from 'react'
import {
  BigHead,
  theme,
  eyesMap,
  eyebrowsMap,
  mouthsMap,
  hairMap,
  facialHairMap,
  clothingMap,
  accessoryMap,
  hatMap,
  bodyMap
} from "@bigheads/core";
import Dialog from '@mui/material/Dialog'

import { log } from '../base'

const Avatar = (props) => {
  const [avatarOptions, setAvatarOptions] = useState(JSON.parse(props.user.avatar))
  const [avatarChangePanel, setAvatarChangePanel] = useState(false)

  useEffect(() => {
    filterThemes()
  }, []);

  const selectRandomKey = (object) => {
    return Object.keys(object)[
      Math.floor(Math.random() * Object.keys(object).length)
    ];
  }

  const filterThemes = () => {
    // dress
    delete clothingMap.naked

    // hair
    delete facialHairMap.none2
    delete facialHairMap.none3

    // hat
    delete hatMap.none2
    delete hatMap.none3
    delete hatMap.none4
    delete hatMap.none5
  }

  const returnNextIndexOptionForPart = (options, currentOption) => {
    const nextOptionIndex = options.indexOf(currentOption) + 1
    if (options.length == nextOptionIndex) {return 0}
    else {return nextOptionIndex}
  }

  const updatePart = (part, currentOption) => {
    let options, updated
    
    switch (part) {
      case 'skinTone':
        options = Object.keys(theme.colors.skin)
        setAvatarOptions(current => {
          updated = {
            ...current,
            skinTone: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'eyes':
        options = Object.keys(eyesMap)
        setAvatarOptions(current => {
          updated = {
            ...current,
            eyes: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'eyebrows':
        options = Object.keys(eyebrowsMap)
        setAvatarOptions(current => {
          updated = {
            ...current,
            eyebrows: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'mouth':
        options = Object.keys(mouthsMap)
        setAvatarOptions(current => {
          updated = {
            ...current,
            mouth: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'hair':
        options = Object.keys(hairMap)
        setAvatarOptions(current => {
          updated = {
            ...current,
            hair: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'facialHair':
        options = Object.keys(facialHairMap)
        setAvatarOptions(current => {
          updated = {
            ...current,
            facialHair: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'clothing':
        options = Object.keys(clothingMap)
        setAvatarOptions(current => {
          updated = {
            ...current,
            clothing: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'accessory':
        options = Object.keys(accessoryMap)
        setAvatarOptions(current => {
          updated = {
            ...current,
            accessory: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'hat':
        options = Object.keys(hatMap)
        setAvatarOptions(current => {
          updated = {
            ...current,
            hat: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'body':
        options = Object.keys(bodyMap)
        setAvatarOptions(current => {
          updated = {
            ...current,
            body: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'hairColor':
        options = Object.keys(theme.colors.hair)
        setAvatarOptions(current => {
          updated = {
            ...current,
            hairColor: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'clothingColor':
        options = Object.keys(theme.colors.clothing)
        setAvatarOptions(current => {
          updated = {
            ...current,
            clothingColor: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'lipColor':
        options = Object.keys(theme.colors.lipColors)
        setAvatarOptions(current => {
          updated = {
            ...current,
            lipColor: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'hatColor':
        options = Object.keys(theme.colors.clothing)
        setAvatarOptions(current => {
          updated = {
            ...current,
            hatColor: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'faceMaskColor':
        options = Object.keys(theme.colors.clothing)
        setAvatarOptions(current => {
          updated = {
            ...current,
            faceMaskColor: options[returnNextIndexOptionForPart(options, currentOption)]
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
      case 'faceMask':
        setAvatarOptions(current => {
          updated = {
            ...current,
            faceMask: current.faceMask ? false : true
          }
          props.setAvatarOptions(updated)
          return updated
        })
        break
    }
  } 

  const changeOptionManually = (part, currentOption) => {
    updatePart(part, currentOption)
  }
  
  const getRandomOptions = () => {
    const skinTone = selectRandomKey(theme.colors.skin);
    const eyes = selectRandomKey(eyesMap);
    const eyebrows = selectRandomKey(eyebrowsMap);;
    const mouth = selectRandomKey(mouthsMap);
    const hair = selectRandomKey(hairMap)
    const facialHair = selectRandomKey(facialHairMap)
    const clothing = selectRandomKey(clothingMap);
    const accessory = selectRandomKey(accessoryMap);
    const graphic = 'none';
    const hat = selectRandomKey(hatMap);
    const body = selectRandomKey(bodyMap);
    
    const hairColor = selectRandomKey(theme.colors.hair);
    const clothingColor = selectRandomKey(theme.colors.clothing);
    const circleColor = 'blue';
    const lipColor = selectRandomKey(theme.colors.lipColors);
    const hatColor = selectRandomKey(theme.colors.clothing);
    const faceMaskColor = selectRandomKey(theme.colors.clothing);
  
    const mask = true;
    const faceMask = false;
    const lashes = Math.random() > 0.5;

    const avatarRandomOption = {
      skinTone,
      eyes,
      eyebrows,
      mouth,
      hair,
      facialHair,
      clothing,
      accessory,
      graphic,
      hat,
      body,
      hairColor,
      clothingColor,
      circleColor,
      lipColor,
      hatColor,
      faceMaskColor,
      mask,
      faceMask,
      lashes
    }
  
    setAvatarOptions(avatarRandomOption)
    props.setAvatarOptions(avatarRandomOption)
  }
    
  return ( 
    <div>
        <h3>تصویر پروفایل</h3>
        <div className='items-center text-center md:flex'>
          
          <button className='text-center' onClick={() => setAvatarChangePanel(true)}>
            <div className='w-[12rem] h-[12rem] md:mx-0 mx-auto'>
              <BigHead {...avatarOptions} />
            </div>
            برای تغییر آواتار کلیک کنید
          </button>
          
          <Dialog
              open={avatarChangePanel}
              aria-labelledby="آواتار کاربر"
              aria-describedby="تغییر آواتار"
          >
            <div className='bg-gradient-to-t from-[#771118] to-[#ac272e] text-white p-8 rounded-lg relative'>
              <button className='absolute text-3xl result__popUpQuizSuggester__closeBtn left-4 top-4' onClick={() => setAvatarChangePanel(false)}>
                  <svg class="h-6 w-6 text-white"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
              
              <div className='w-[12rem] h-[12rem] md:mx-0 mx-auto'>
                <BigHead {...avatarOptions} />
              </div>
              
              <h4 className='text-center md:text-right'>برای تغییر روی گزینه مربوطه کلیک کنید</h4>
              <h4 onClick={() => getRandomOptions()} className='px-4 py-1 mx-auto my-5 border border-gray-400 rounded-lg h-fit w-fit md:mx-0 hover:cursor-pointer md:my-3'>تغییر رندوم همه</h4>
              
              <div className='flex flex-wrap justify-between mx-2 mt-3 space-y-3 space-y-reverse'>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('skinTone', avatarOptions.skinTone)}>
                  <h4>رنگ پوست</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('body', avatarOptions.body)}>
                  <h4>بدن</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('eyes', avatarOptions.eyes)}>
                  <h4>چشم</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('accessory', avatarOptions.accessory)}>
                  <h4>عینک</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('eyebrows', avatarOptions.eyebrows)}>
                  <h4>ابرو</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('mouth', avatarOptions.mouth)}>
                  <h4>دهان</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('lipColor', avatarOptions.lipColor)}>
                  <h4>رنگ لب ها</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('facialHair', avatarOptions.facialHair)}>
                  <h4>مو صورت</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('hair', avatarOptions.hair)}>
                  <h4>مو سر</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('hairColor', avatarOptions.hairColor)}>
                  <h4>رنگ موها</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('hat', avatarOptions.hat)}>
                  <h4>کلاه</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('hatColor', avatarOptions.hatColor)}>
                  <h4>رنگ کلاه</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('clothing', avatarOptions.clothing)}>
                  <h4>لباس</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('clothingColor', avatarOptions.clothingColor)}>
                  <h4>رنگ لباس</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('faceMask', avatarOptions.faceMask)}>
                  <h4>ماسک</h4>
                </div>
                <div className='flex px-4 py-1 space-x-3 space-x-reverse border border-gray-400 rounded-lg hover:cursor-pointer h-fit' onClick={() => changeOptionManually('faceMaskColor', avatarOptions.faceMaskColor)}>
                  <h4>رنگ ماسک</h4>
                </div>
              </div>
            </div>
          </Dialog>
        </div>
    </div>
  );
}
 
export default Avatar;