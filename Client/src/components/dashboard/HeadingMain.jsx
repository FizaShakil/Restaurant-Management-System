import React from 'react'

const HeadingMain = ({h}) => {
  return (
    <div>
        <div className='text-center font-bold text-3xl mb-8 text-red-800 md:text-4xl'>
        {h}
        </div>
    </div>
  )
}

export default HeadingMain