import React, { useState } from 'react'
import './style.css'
import CustomButton from '../CustomButton'
import CustomInput from '../CustomInput'
import { useAddTodoMutation } from '../../redux'

function CreateTodo() {
  const [addTodo, { isLoading }] = useAddTodoMutation()
  const [text, setText] = useState<string>('')

  const handleAddTodo = async () => {
    if (text.length === 0 || text.length <= 3) 
      return alert('Необходимо ввести больше 3 символов')
    
    await addTodo({text: text})
    setText('')
  }

  return (
    <div className="create-todo">
      <CustomInput
        placeholder="Добавить новую задачу"
        className="create-todo__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <CustomButton 
        className="create-todo__button"
        icon="plus"
        onClick={() => handleAddTodo()}
        isLoading={isLoading}
      >
        Создать
      </CustomButton>
      
    </div>
  )
}

export default CreateTodo