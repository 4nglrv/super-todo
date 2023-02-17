import { InputHTMLAttributes } from 'react';
import './style.css'

function CustomInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="text"
      className={`custom-input ${props.className}`}
    />
  )
}

export default CustomInput