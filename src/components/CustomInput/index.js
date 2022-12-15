import React from 'react'
import './style.css'

function CustomInput(props) {
  return (
    <input 
      {...props}
      type="text"
      className={`custom-input ${props.className}`}
    />
  )
}

export default CustomInput