import React from 'react'

const Title = ({ title, subTitle, align, light = false }) => {
    return (
        <div className={`flex flex-col justify-center items-center text-center ${align === "left" && "md:items-start md:text-left"}`}>
            <h1 className={`text-3xl md:text-4xl font-bold ${light ? "text-white" : "text-primary"} font-montserrat`}>{title}</h1>
            <p className={`text-sm md:text-base mt-2 max-w-174 font-inter ${light ? "text-white/80" : "text-gray-500/90"}`}>{subTitle}</p>
        </div>
    )
}

export default Title


