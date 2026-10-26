import React from 'react'

const HeadingMain = ({ h, subtitle }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{h}</h1>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    </div>
  )
}

export default HeadingMain
