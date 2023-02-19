import './style.css'
import LoaderIcon from '../Svg/Loader'
import Task from './Task'
import TaskCounter from './TaskCounter'
import { useGetTodosQuery } from '../../redux'
import { ElementRef, useCallback, useRef } from 'react'
import { ITodoResponse } from '../../types/store/mockApi'

const TaskList = () => {
	const { data = [], isLoading } = useGetTodosQuery()
  const taskRef = useRef<ElementRef<typeof Task>>(null)
  const tasksRef = useRef<HTMLDivElement>(null)

	const RenderTaskMessage = useCallback(() => {
		return (
			<div className='create-task-message'>
				<img className='clipboard-img' width='56' height='56' src='/assets/Clipboard.png' alt='Clipboard' />
				<div className='create-task-message__first'>У Вас еще нет созданных задач</div>
				<div className='create-task-message__second'>Создавайте задачи и организуйте свои дела</div>
			</div>
		)
	}, [])

	function renderTasks() {
		if (data.length === 0) return RenderTaskMessage()
		return data.map((todo: ITodoResponse) => {
			return <Task key={todo.id} data={todo} ref={taskRef} tasksRef={tasksRef} />
		})
  }

	return (
		<div 
      className='task-list'
      onMouseUp={() => taskRef.current?.removeListeners()}
    >
			<TaskCounter />
			<div id='tasks' ref={tasksRef} className='tasks'>
				{isLoading ? <LoaderIcon /> : renderTasks()}
			</div>
		</div>
	)
}

export default TaskList
