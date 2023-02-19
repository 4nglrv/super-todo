import './style.css'
import { TextareaHTMLAttributes } from 'react'

export default function CustomTextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`custom-input ${props.className}`}
    />
  )
}