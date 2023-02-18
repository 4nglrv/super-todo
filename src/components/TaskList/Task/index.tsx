import './style.css'
import './task-text.css'
import { DragEvent, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react'
import { ITodoResponse } from '../../../types/store/mockApi'
import TaskItem from './Item'
import classNames from 'classnames'
import { useUpdateTodoMutation } from '../../../redux'
import throttle from '../../../utils/throttle'

type Props = {
	data: ITodoResponse
}

interface IItitialPos {
	x: number
	y: number
	x1: number
	y1: number
}

export default function Task(props: Props) {
	// const [initialSize, setInitialSize] = useState<{
	// 	width: number
	// 	height: number
	// }>({
	// 	width: 300,
	// 	height: 300,
	// })
	const maxBlockPosX = 5000
	const maxBlockPosY = 5000
	const [initialPos, setInitialPos] = useState<IItitialPos>({
		x: props.data.x > maxBlockPosX ? props.data.x / 100 : props.data.x,
		y: props.data.y > maxBlockPosY ? props.data.y / 1000 : props.data.y,
		x1: 0,
		y1: 0,
	})
	const [updateTodo] = useUpdateTodoMutation()
	const [isCompleted, setIsCompleted] = useState<boolean>(props.data.isCompleted)
	const [isDeleted, setIsDeleted] = useState<boolean>(false)
	const [isEdit, setIsEdit] = useState<boolean>(false)
	const [isDrag, setIsDrag] = useState<boolean>(false)
  const [event, setEvent] = useState<'mousemove' | 'touchmove'>('mousemove')
	const taskListBlock = document.getElementById('tasks') as HTMLDivElement
	const initialPosRef = useRef<IItitialPos>()
  
  initialPosRef.current = initialPos
  useEffect(() => {
    if (window.innerWidth < 768) {
      setEvent('touchmove')
    }
  }, [])

	const onChangeCompleteHandler = useCallback((val: boolean) => {
		setIsCompleted(val)
	}, [])

	const onChangeDeleteHandler = useCallback((val: boolean) => {
		setIsDeleted(val)
	}, [])

	const onChangeEditHandler = useCallback((val: boolean) => {
		setIsEdit(val)
	}, [])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const dragTask = useCallback(throttle((ev: MouseEvent & TouchEvent) => {
		if (initialPosRef.current === undefined) return
		let currPosX = 0
		let currPosY = 0
    const currClientX = ev.clientX || ev.targetTouches[0].clientX
    const currClientY = ev.clientY || ev.targetTouches[0].clientY
		const mouseInBlockPosX = Math.ceil(
			currClientX + taskListBlock.scrollLeft - initialPosRef.current.x1 - taskListBlock.offsetLeft
		)
		const mouseInBlockPosY = Math.ceil(
			currClientY + taskListBlock.scrollTop - initialPosRef.current.y1 - taskListBlock.offsetTop
		)
		const isEdgeBlockX = mouseInBlockPosX < 0 || mouseInBlockPosX > maxBlockPosX + 10
		const isEdgeBlockY = mouseInBlockPosY < 0 || mouseInBlockPosY > maxBlockPosY + 10
		// If user drag to edge block
		if (isEdgeBlockX || isEdgeBlockY || initialPosRef.current.x1 <= 0 || initialPosRef.current.y1 <= 0) {
			onEndDragHandler()
		}
		currPosX = mouseInBlockPosX < 0 ? 0 : mouseInBlockPosX > maxBlockPosX ? maxBlockPosX : mouseInBlockPosX
		currPosY = mouseInBlockPosY < 0 ? 0 : mouseInBlockPosY > maxBlockPosX ? maxBlockPosX : mouseInBlockPosY
		setInitialPos((prev) => ({ ...prev, x: currPosX, y: currPosY }))
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, 25), [])

	const onStartDragHandler = (ev: SyntheticEvent<HTMLDivElement, MouseEvent & TouchEvent>) => {
    let target = ev.target as HTMLDivElement
    const rect = target.getBoundingClientRect()
		const posX = ev.nativeEvent.offsetX || ev.nativeEvent.targetTouches[0].clientX - rect.left
		const posY = ev.nativeEvent.offsetY || ev.nativeEvent.targetTouches[0].clientY - rect.top
		setInitialPos((prev) => ({ ...prev, x1: posX, y1: posY }))
		taskListBlock.addEventListener(event, dragTask)
		setIsDrag(true)
		console.log('ondown (add ev): ', event)
	}

	const onEndDragHandler = (ev?: SyntheticEvent<HTMLDivElement>) => {
		taskListBlock.removeEventListener(event, dragTask)
		setIsDrag(false)
		console.log('onup (remove ev): ', event)
		if (initialPos.x === props.data.x || initialPos.y === props.data.y) return
		updateTodo({ id: props.data.id, x: initialPos.x, y: initialPos.y })
	}

	function resizeHandler(ev: DragEvent) {
		console.log(ev)
	}

	return (
		<div
      id='task'
			className={classNames('task', {
				'task-completed': isCompleted && !isEdit,
				'task-deleted': isDeleted,
				'is-dragging': isDrag,
			})}
			style={{
				top: `${initialPosRef.current.y}px`,
				left: `${initialPosRef.current.x}px`,
			}}
      onTouchEnd={() => onEndDragHandler()}
			onMouseUp={() => onEndDragHandler()}
		>
			<div
				id='task__draggable-block'
				className='task__draggable-block'
        onTouchStart={(ev) => onStartDragHandler(ev as any)}
        onMouseDown={(ev) => onStartDragHandler(ev as any)}
			/>
			<div className='task__wrapper'>
				<TaskItem
					onChangeComplete={(val) => onChangeCompleteHandler(val)}
					onChangeDelete={(val) => onChangeDeleteHandler(val)}
					onChangeEdit={(val) => onChangeEditHandler(val)}
					data={props.data}
				/>
			</div>
			<div draggable='true' className='task__resize-block' onDrag={(ev) => resizeHandler(ev)} />
		</div>
	)
}