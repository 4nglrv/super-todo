import './style.css'
import LoaderIcon from '../Svg/Loader'
import Task from './Task'
import TaskCounter from './TaskCounter'
import { useGetTodosQuery } from '../../redux'
import { useCallback } from 'react'
import { ITodoResponse } from '../../types/store/mockApi'

const TaskList = () => {
	console.log('rerender list')
	const { data = [], isLoading } = useGetTodosQuery()

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
			return <Task key={todo.id} data={todo} />
		})
  }

	function stop(ev: Event) {
		ev.stopPropagation()
		ev.preventDefault()
	}

	return (
		<div className='task-list' onDragOver={() => stop}>
			<TaskCounter />
			<div id='tasks' className='tasks'>
				{isLoading ? <LoaderIcon /> : renderTasks()}
			</div>
		</div>
	)
}

export default TaskList
