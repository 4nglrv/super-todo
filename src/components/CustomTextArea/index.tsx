import './style.css'
import { TextareaHTMLAttributes } from 'react'

const CustomTextArea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      {...props}
      className={`custom-input ${props.className}`}
    />
  )
}

export default CustomTextArea