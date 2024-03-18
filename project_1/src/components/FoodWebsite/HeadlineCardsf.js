import React from 'react'
import egg from './egg.jpg'
import sandwich from './sandwich.jpg'
import dessert from './dessert.jpg'

const HeadlineCardsf = () => {
  return (
    <div className='max-w-[1640] mx-auto p-4 py-12 grid md:grid-cols-3 gap-6'>
      {/*card*/}
      <div className='rounded-xl relative'>
        {/*overlay*/}
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white ' >
            <p className='font-bold text-2xl px-2 pt-2'>Sun's Out, BOGO's Out</p>
            <p className='px-2'>Through 8/26</p>
            <button className='border-white bg-white text-black mx-2 absolute bottom-4'>Order Now</button>
        </div>
        <img className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl' src={egg} alt='/'/>
      </div>

      {/*card*/}
      <div className='rounded-xl relative'>
        {/*overlay*/}
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white ' >
            <p className='font-bold text-2xl px-2 pt-2'>New Restaurants</p>
            <p className='px-2'>Added Daily</p>
            <button className='border-white bg-white text-black mx-2 absolute bottom-4'>Order Now</button>
        </div>
        <img className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl' src={sandwich} alt='/'/>
      </div>

      {/*card*/}
      <div className='rounded-xl relative'>
        {/*overlay*/}
        <div className='absolute w-full h-full bg-black/50 rounded-xl text-white ' >
            <p className='font-bold text-2xl px-2 pt-2'>We Deliver Desserts Too</p>
            <p className='px-2'>Tasty Treats</p>
            <button className='border-white bg-white text-black mx-2 absolute bottom-4'>Order Now</button>
        </div>
        <img className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl' src={dessert} alt='/'/>
      </div>
    </div>
  )
}

export default HeadlineCardsf
