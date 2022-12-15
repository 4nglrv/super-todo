import React, { useState } from 'react'
import { useDeleteTodoMutation, useUpdateTodoMutation } from '../../../redux/mockApi'
import Rolling from '../../Rolling'
import './style.css'

function Task(props) {
  const [deleteTodo] = useDeleteTodoMutation()
  const [updateTodo, { isLoading }] = useUpdateTodoMutation()

  const [isCompleted, setIsCompleted] = useState(props.data.isCompleted)
  const [isDeleted, setIsDeleted] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [todoText, setTodoText] = useState(props.data.text)
  const [isEnter, setIsEnter] = useState(true)

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

  function CheckIcon() {
    if (isLoading) return <Rolling className="update-todo-rolling" />
    return (
      <svg className="check-icon" width="24" height="24" viewBox="0 0 24 24">
        <path d="M10 13.6L15.9 7.7C16.0834 7.51667 16.3167 7.425 16.6 7.425C16.8834 7.425 17.1167 7.51667 17.3 7.7C17.4834 7.88334 17.575 8.11667 17.575 8.4C17.575 8.68334 17.4834 8.91667 17.3 9.1L10.7 15.7C10.5 15.9 10.2667 16 10 16C9.73338 16 9.50005 15.9 9.30005 15.7L6.70005 13.1C6.51672 12.9167 6.42505 12.6833 6.42505 12.4C6.42505 12.1167 6.51672 11.8833 6.70005 11.7C6.88338 11.5167 7.11672 11.425 7.40005 11.425C7.68338 11.425 7.91672 11.5167 8.10005 11.7L10 13.6Z" />
      </svg>
    )
  }

  function TaskIcon() {
    return (
      <svg className="task-edit" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2133_108)">
          <path d="M11.4167 7.33333H7.33341C7.024 7.33333 6.72725 7.45625 6.50846 7.67504C6.28966 7.89384 6.16675 8.19058 6.16675 8.5V16.6667C6.16675 16.9761 6.28966 17.2728 6.50846 17.4916C6.72725 17.7104 7.024 17.8333 7.33341 17.8333H15.5001C15.8095 17.8333 16.1062 17.7104 16.325 17.4916C16.5438 17.2728 16.6667 16.9761 16.6667 16.6667V12.5833" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15.7917 6.45833C16.0238 6.22627 16.3386 6.0959 16.6667 6.0959C16.9949 6.0959 17.3097 6.22627 17.5417 6.45833C17.7738 6.6904 17.9042 7.00514 17.9042 7.33333C17.9042 7.66152 17.7738 7.97627 17.5417 8.20833L12.0001 13.75L9.66675 14.3333L10.2501 12L15.7917 6.45833Z" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2133_108">
            <rect width="14" height="14" transform="translate(5 5)" />
          </clipPath>
        </defs>
      </svg>
    )
  }

  function TaskButtons() {
    return (
      <div className="task-buttons">
        <button onClick={() => handleEditTodo()} className="task-btn">
          {
            !isEdit
             ? TaskIcon()
             : CheckIcon()
          }
        </button>

        <button className="task-btn task-remove" onClick={() => handleDeleteTodo(props.data.id)}>
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.2021 9.98548H12.8716V15.5073H14.2021V9.98548Z" />
            <path d="M11.4624 9.98548H10.1318V15.5073H11.4624V9.98548Z" />
            <path d="M18.478 7.16712C18.4754 7.03061 18.4295 6.89846 18.3469 6.78975C18.2642 6.68104 18.1492 6.6014 18.0184 6.56232C17.9596 6.53782 17.8974 6.52252 17.8339 6.51696H14.2868C14.1525 6.07791 13.8808 5.69355 13.5117 5.42047C13.1426 5.14739 12.6956 5 12.2365 5C11.7774 5 11.3304 5.14739 10.9613 5.42047C10.5922 5.69355 10.3205 6.07791 10.1862 6.51696H6.63911C6.58068 6.51814 6.52269 6.52729 6.46674 6.54418H6.45162C6.31318 6.58701 6.19334 6.67547 6.11163 6.79515C6.02992 6.91483 5.99117 7.05866 6.00169 7.20319C6.01222 7.34771 6.0714 7.48441 6.16958 7.59099C6.26776 7.69757 6.39916 7.76774 6.54234 7.79006L7.25298 17.5334C7.26382 17.9127 7.41693 18.2741 7.68191 18.5458C7.94688 18.8175 8.30435 18.9797 8.68332 19H15.7867C16.1662 18.9804 16.5244 18.8186 16.79 18.5468C17.0556 18.2751 17.2092 17.9132 17.22 17.5334L17.9277 7.79914C18.0802 7.77797 18.22 7.70232 18.3212 7.58615C18.4223 7.46999 18.478 7.32116 18.478 7.16712ZM12.2365 6.21456C12.3661 6.21458 12.4943 6.24146 12.6129 6.29351C12.7316 6.34556 12.8382 6.42164 12.926 6.51696H11.547C11.6346 6.42135 11.7411 6.34507 11.8599 6.29299C11.9786 6.24092 12.1069 6.21421 12.2365 6.21456ZM15.7867 17.7904H8.68332C8.60168 17.7904 8.47467 17.6573 8.45955 17.4457L7.75798 7.81123H16.715L16.0135 17.4457C15.9984 17.6573 15.8714 17.7904 15.7867 17.7904Z" />
          </svg>
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
          ? <div className="task-text__input-container"><input disabled={!isEnter} htmlFor={props.data.id} className="task-text__input" type="text" value={todoText} onChange={(e) => setTodoText(e.target.value)} /></div>
          : RenderTask()
      }
      {TaskButtons()}

    </div>
  )
}

export default Task