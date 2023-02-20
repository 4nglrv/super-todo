import './style.css'
import { useEffect, useState } from 'react'

import { useGetTodosQuery } from '../../../redux'

const TaskCounter = () => {
  const { data = [] } = useGetTodosQuery()
  const [ completedCount, setCompletedCount ] = useState<number>(0)

  useEffect(() => {
    let count = 0
    data.forEach(todo => {
      if (todo.isCompleted) count += 1
    })
    setCompletedCount(count)
  }, [ data ])

  return (
    <div className="task-counter">
      <div className="task-counter__left">
        Созданные задачи
        <span className="task-amount"> {data.length}</span>
      </div>
      
      <div className="task-counter__right">
        Завершено
        <span className="task-amount">
         {
           completedCount > 0 
             ? `${completedCount} из ${data.length}`
             : 0
         }
        </span>
      </div>
    </div>
  )
}

export default TaskCounter