import './style.css'
import { InputHTMLAttributes } from 'react'

export default function CustomInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="text"
      className={`custom-input ${props.className}`}
    />
  )
}