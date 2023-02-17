import React from 'react'
import RollingIcon from '../Svg/Rolling'
import PlusIcon from '../Svg/Plus'
import './style.css'

function Icon(icon) {
  switch (icon) {
    case 'plus':
      return <PlusIcon/>

    default: return null
  }
}

export default function CustomButton({ children, ...props }) {
  return (
    <button
      onClick={props.onClick}
      className={`custom-button ${props.className}`}
      disabled={props.isLoading || props.isDisabled}
    >
      <div className='custom-button-container'>
        <div className={`custom-button-content ${props.isLoading ? 'loading' : ''}`}>
          {children}
          {props.icon ? Icon(props.icon) : null}
        </div>
        { props.isLoading ? <RollingIcon className="rolling-btn active" /> : null }
      </div>
    </button>
  )
}