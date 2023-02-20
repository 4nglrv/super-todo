import './style.css'
import { InputHTMLAttributes } from 'react'

const CustomInput = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      type="text"
      className={`custom-input ${props.className}`}
    />
  )
}

export default CustomInput