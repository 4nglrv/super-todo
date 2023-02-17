import React from 'react'
import './style.css'
import LoaderIcon from '../Svg/Loader'
import Task from './Task'
import TaskCounter from './TaskCounter'
import { useGetTodosQuery } from '../../redux'

function RenderTaskMessage() {
  return (
    <div className="create-task-message">
      <img className="clipboard-img" width="56" height="56" src="/assets/Clipboard.png" alt="Clipboard" />
      <div className="create-task-message__first">
        У Вас еще нет созданных задач
      </div>
      <div className="create-task-message__second">
        Создавайте задачи и организуйте свои дела
      </div>
    </div>
  )
}

export default function TaskList() {
  const { data = [], isLoading } = useGetTodosQuery()

  function renderTasks() {
    if (data.length === 0) return RenderTaskMessage()
    return data.map(todo => {
      return <Task key={todo.id} data={todo} />
    })
  }

  return (
    <div className="task-list">
      <TaskCounter />
      <div className="tasks">
        {
          isLoading ? <LoaderIcon /> : renderTasks()
        }
      </div>
    </div>
  )
}