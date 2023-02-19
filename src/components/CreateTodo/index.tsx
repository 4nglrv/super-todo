import './style.css'
import { useState } from 'react'
import CustomButton from '../CustomButton'
import CustomTextArea from '../CustomTextArea'
import { useAddTodoMutation } from '../../redux'

function CreateTodo() {
  const [addTodo, { isLoading }] = useAddTodoMutation()
  const [text, setText] = useState<string>('')

  const addTodoHandler = async () => {
    if (text.length === 0 || text.length <= 3) 
      return alert('Необходимо ввести больше 3 символов')
    
    await addTodo({text: text})
    setText('')
  }

  return (
    <div className="create-todo">
      <CustomTextArea
        placeholder="Добавить новую задачу"
        className="create-todo__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="create-todo__button-wrapper">
        <CustomButton 
          className="create-todo__button"
          icon="plus"
          onClick={() => addTodoHandler()}
          isloading={isLoading ? 1 : 0}
          isdisabled={!window.navigator.onLine ? 1 : 0}
        >
          Создать
        </CustomButton>
      </div>

      
    </div>
  )
}

export default CreateTodo