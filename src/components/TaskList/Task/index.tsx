import './style.css'
import './task-text.css'
import { DragEvent, SyntheticEvent, useCallback, useRef, useState } from 'react'
import { ITodoResponse } from '../../../types/store/mockApi'
import TaskItem from './Item'
import classNames from 'classnames'
import { useUpdateTodoMutation } from '../../../redux'

type Props = {
	data: ITodoResponse
}

interface IItitialPos {
  x: number,
  y: number,
  x1: number,
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
    y1: 0
	})
  const [updateTodo] = useUpdateTodoMutation()
  const [isCompleted, setIsCompleted] = useState<boolean>(props.data.isCompleted)
  const [isDeleted, setIsDeleted] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isDrag, setIsDrag] = useState<boolean>(false)
  const taskListBlock = document.getElementById('tasks') as HTMLDivElement
  const initialPosRef = useRef<IItitialPos>();

  initialPosRef.current = initialPos
  
  const onChangeCompleteHandler = (val: boolean) => {
    setIsCompleted(val)
  } 

  const onChangeDeleteHandler = (val: boolean) => {
    setIsDeleted(val)
  }

  const onChangeEditHandler = (val: boolean) => {
    setIsEdit(val)
  }

  const dragTask = useCallback((ev: MouseEvent) => {
    if (initialPosRef.current === undefined) return
    let currPosX = 0
    let currPosY = 0
    const mouseInBlockPosX = Math.ceil(ev.clientX + taskListBlock.scrollLeft - initialPosRef.current.x1 - taskListBlock.offsetLeft)
    const mouseInBlockPosY = Math.ceil(ev.clientY + taskListBlock.scrollTop - initialPosRef.current.y1 - taskListBlock.offsetTop)
    const isEdgeBlockX = mouseInBlockPosX < 0 || mouseInBlockPosX > maxBlockPosX + 10
    const isEdgeBlockY = mouseInBlockPosY < 0 || mouseInBlockPosY > maxBlockPosY + 10
    // If user drag to edge block
    if (isEdgeBlockX || isEdgeBlockY 
      || initialPosRef.current.x1 <= 0 
      || initialPosRef.current.y1 <= 0) {
        onMouseUpHandler()
      }
    currPosX = mouseInBlockPosX < 0 ? 0 : mouseInBlockPosX > maxBlockPosX ? maxBlockPosX : mouseInBlockPosX
    currPosY = mouseInBlockPosY < 0 ? 0 : mouseInBlockPosY > maxBlockPosX ? maxBlockPosX : mouseInBlockPosY
    setInitialPos((prev) => ({...prev, x: currPosX, y: currPosY }))
  }, [])
    

	const onDownMouseHandler = (ev: SyntheticEvent<HTMLDivElement, MouseEvent>) => {
    const posX = ev.nativeEvent.offsetX
		const posY = ev.nativeEvent.offsetY
		setInitialPos((prev) => ({ ...prev, x1: posX, y1: posY }))
    taskListBlock.addEventListener('mousemove', dragTask)
    setIsDrag(true)
    console.log('ondown (add ev): ', posX, posY)
  }

	const onMouseUpHandler = (ev?: SyntheticEvent<HTMLDivElement>) => {
    taskListBlock.removeEventListener('mousemove', dragTask)
    setIsDrag(false)
    updateTodo({ id: props.data.id, x: initialPos.x, y: initialPos.y })
    console.log('onup (remove ev)')
  }

	function resizeHandler(ev: DragEvent) {
		console.log(ev)
	}

	return (
		<div
			className={classNames('task', {
        'task-completed': isCompleted && !isEdit,
        'task-deleted': isDeleted,
        'is-dragging': isDrag,
      })}
			style={{
				top: `${initialPosRef.current.y}px`,
				left: `${initialPosRef.current.x}px`,
			}}
      onMouseUp={(ev) => onMouseUpHandler(ev)}
		>
			<div
        id='task__draggable-block'
				className='task__draggable-block'
        onMouseDown={(ev) => onDownMouseHandler(ev)}
			/>
			<div className="task__wrapper">
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