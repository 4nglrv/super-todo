import React, { useEffect, useRef, useState } from 'react'
import { useDeleteTodoMutation, useUpdateTodoMutation } from '../../../redux/mockApi'
import RollingIcon from '../../Svg/Rolling'
import Remove from '../../Svg/Remove'
import TaskIcon from '../../Svg/Task'
import CheckIcon from '../../Svg/Check'
import './style.css'
import { ITodoResponse } from '../../../types/store/mockApi'

type Props = {
  data: ITodoResponse
}

export default function Task(props: Props) {
  const [deleteTodo] = useDeleteTodoMutation()
  const [updateTodo, { isLoading }] = useUpdateTodoMutation()

  const inputRef = useRef<HTMLInputElement>()
  const [isCompleted, setIsCompleted] = useState<boolean>(props.data.isCompleted)
  const [isDeleted, setIsDeleted] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [todoText, setTodoText] = useState<string>(props.data.text)
  const [isEnter, setIsEnter] = useState<boolean>(true)

  const handleDeleteTodo = async () => {
    setIsDeleted(true)
    await deleteTodo(props.data.id).unwrap()
  }

  const handleSetCompleted = async () => {
    setIsCompleted(!isCompleted)
    await updateTodo({ id: props.data.id, isCompleted: !isCompleted }).unwrap()
  }

  const handleEditTodo = async () => {
    setIsEnter(false)
    if (isEdit) {
      await updateTodo({id: props.data.id, text: todoText}).unwrap()
    }
    setIsEnter(true)
    setIsEdit(!isEdit)
  }

  useEffect(() => {
    if (isEdit) {
      inputRef.current.focus()
    }
  }, [isEdit, inputRef])

  function RenderCheck() {
    if (isLoading) return <RollingIcon className="update-todo-rolling" />
    return <CheckIcon />
  }

  function IsEdit() {
    if (!isEdit) return <TaskIcon />
    return RenderCheck()
  }

  function TaskButtons() {
    return (
      <div className="task-buttons">
        <button onClick={() => handleEditTodo()} className="task-btn">
          { IsEdit() }
        </button>

        <button className="task-btn task-remove" onClick={() => handleDeleteTodo()}>
          <Remove />
        </button>
      </div>
    )
  }

  function RenderTask() {
    return (
      <div className="task-content" onChange={() => handleSetCompleted()}>
        <div>
          <input type="checkbox" defaultChecked={isCompleted} id={props.data.id} name={props.data.id} />
        </div>
        <label className="task-text" htmlFor={props.data.id}>
          {todoText}
        </label>
      </div>
    )
  }

  return (
    <div className={`task ${isCompleted ? "task-completed" : ""} ${isDeleted ? "task-deleted" : ""}`}>

      {
        isEdit
          ? <div className="task-text__input-container">
              <input 
                disabled={!isEnter}
                className="task-text__input" 
                type="text" 
                value={todoText} 
                onChange={(e) => setTodoText(e.target.value)} 
                ref={inputRef}
                />
            </div>
          : RenderTask()
      }
      {TaskButtons()}

    </div>
  )
}