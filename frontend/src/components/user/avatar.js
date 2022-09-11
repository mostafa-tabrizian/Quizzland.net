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

import { log } from '../base'

const Avatar = (props) => {
  const [avatarOptions, setAvatarOptions] = useState(JSON.parse(props.user.avatar))

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
        <div className='items-center md:flex'>
          <div className='w-[12rem] h-[12rem] md:mx-0 mx-auto'>
            <BigHead {...avatarOptions} />
          </div>
          <div>
            <h4 className='text-center md:text-right'>برای تغییر روی گزینه مربوطه کلیک کنید</h4>
            <h4 onClick={() => getRandomOptions()} className='h-fit w-fit mx-auto md:mx-0 hover:cursor-pointer md:my-3 my-5 px-4 py-1 border rounded-lg border-[#690D11]'>تغییر رندوم همه</h4>
            
            <div className='flex flex-wrap md:w-[44rem] w-full h-fit space-y-3 space-x-5 space-x-reverse space-y-reverse mt-3'>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('skinTone', avatarOptions.skinTone)}>
                <h4>رنگ پوست</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('body', avatarOptions.body)}>
                <h4>بدن</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('eyes', avatarOptions.eyes)}>
                <h4>چشم</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('accessory', avatarOptions.accessory)}>
                <h4>عینک</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('eyebrows', avatarOptions.eyebrows)}>
                <h4>ابرو</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('mouth', avatarOptions.mouth)}>
                <h4>دهان</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('lipColor', avatarOptions.lipColor)}>
                <h4>رنگ لب ها</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('facialHair', avatarOptions.facialHair)}>
                <h4>مو صورت</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('hair', avatarOptions.hair)}>
                <h4>مو سر</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('hairColor', avatarOptions.hairColor)}>
                <h4>رنگ موها</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('hat', avatarOptions.hat)}>
                <h4>کلاه</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('hatColor', avatarOptions.hatColor)}>
                <h4>رنگ کلاه</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('clothing', avatarOptions.clothing)}>
                <h4>لباس</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('clothingColor', avatarOptions.clothingColor)}>
                <h4>رنگ لباس</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('faceMask', avatarOptions.faceMask)}>
                <h4>ماسک</h4>
              </div>
              <div className='flex hover:cursor-pointer space-x-3 space-x-reverse h-fit px-4 py-1 border rounded-lg border-[#690D11]' onClick={() => changeOptionManually('faceMaskColor', avatarOptions.faceMaskColor)}>
                <h4>رنگ ماسک</h4>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
 
export default Avatar;