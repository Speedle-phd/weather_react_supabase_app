import React from 'react'
import { ImLocation } from 'react-icons/im'

interface LocationProps {
   state: string
   country: string
   name: string
   lat: number
   long: number
   isGps: boolean
   isSet: boolean
   description: string
   icon: string
   temp: number
}

const LocationGridTile = ({ location }: { location: LocationProps | undefined }) => {
   return (
      <div className='absolute inset-4 bg-white/70 backdrop-blur-sm rounded-lg grid grid-rows-6 grid-cols-4 px-8 py-2'>
         {location?.isGps ? (
            <ImLocation className='text-black/40 row-span-1 col-start-6 col-row-1' />
         ) : null}
         <h5 className='row-[1] col-[1/5] text-2xl'>{location?.name}</h5>
         <div className='text-[0.6rem] text-black/40 row-[2] col-[1/-1]'>
            {location?.state}, {location?.country}
         </div>
         <div className='flex flex-col row-[3/-1] relative isolate'>
            <figure className='absolute top-0 md:top-[-5px]'>
               <img
                  className='min-w-[60px] aspect-square'
                  src={`https://openweathermap.org/img/wn/${
                     location!.icon
                  }@2x.png`}
                  alt={'weather icon'}
               />
            </figure>
            <div className='text-[0.7rem] text-black/50 absolute bottom-0 left-4'>
               {location?.description}
            </div>
         </div>
         <div className='text-lg text-orange-900/80 row-[5] col-[4/-1]'>{`${
            location?.temp.toFixed(1) ?? '0'
         }°C`}</div>
      </div>
   )
}

export default LocationGridTile
