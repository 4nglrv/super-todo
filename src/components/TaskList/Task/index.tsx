import './style.css'
import './task-text.css'
import { memo, MouseEvent, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react'
import { ITodoResponse } from '../../../types/store/mockApi'
import TaskItem from './Item'
import classNames from 'classnames'
import { useUpdateTodoMutation } from '../../../redux'
import throttle from '../../../utils/throttle'

type Props = {
	data: ITodoResponse
}

interface IItitialPos {
	x: number,
	y: number,
	x1: number,
	y1: number
}

interface IItitialSize {
	width: number,
	height: number,
  width1: number,
	height1: number
}

export default memo(function Task(props: Props) {
	const [initialSize, setInitialSize] = useState<IItitialSize>({
		width: props.data.width,
		height: props.data.height,		
    width1: 0,
		height1: 0,
	})
	const maxBlockPosX = 5000
	const maxBlockPosY = 5000
	const [initialPos, setInitialPos] = useState<IItitialPos>({
		x: props.data.x,
		y: props.data.y,
		x1: 0,
		y1: 0,
	})
	const [updateTodo] = useUpdateTodoMutation()
	const [isCompleted, setIsCompleted] = useState<boolean>(props.data.isCompleted)
	const [isDeleted, setIsDeleted] = useState<boolean>(false)
	const [isEdit, setIsEdit] = useState<boolean>(false)
	const [isDrag, setIsDrag] = useState<boolean>(false)
	const [event, setEvent] = useState<'mousemove' | 'touchmove'>('mousemove')
  const taskRef = useRef<HTMLDivElement>(null)
	const taskListBlock = document.getElementById('tasks') as HTMLDivElement
	const initialPosRef = useRef<IItitialPos>()
	const initialSizeRef = useRef<IItitialSize>()

	initialPosRef.current = initialPos
  initialSizeRef.current = initialSize

	useEffect(() => {
		if (window.innerWidth < 768) {
			setEvent('touchmove')
		}
	}, [])

	const onChangeCompleteHandler = (val: boolean) => {
		setIsCompleted(val)
	}

	const onChangeDeleteHandler = (val: boolean) => {
		setIsDeleted(val)
	}

	const onChangeEditHandler = (val: boolean) => {
		setIsEdit(val)
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const dragTask = useCallback(
		throttle((ev: MouseEvent & TouchEvent) => {
			if (initialPosRef.current === undefined || taskListBlock === undefined) return
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
		}, 25),
		[]
	)

	const onStartDragHandler = (ev: any) => {
		if (taskListBlock === undefined) return
		let posX: number = 0
		let posY: number = 0

		if (event === 'mousemove') {
			posX = ev.nativeEvent.offsetX 
			posY = ev.nativeEvent.offsetY
		}

		if (event === 'touchmove' && ev.nativeEvent?.targetTouches !== undefined) {
			let target = ev.target as HTMLDivElement
			const rect = target.getBoundingClientRect()
			posX = ev.nativeEvent.targetTouches[0].clientX - rect.left
			posY = ev.nativeEvent.targetTouches[0].clientY - rect.top
		}

		setInitialPos((prev) => ({ ...prev, x1: posX, y1: posY }))
		taskListBlock.addEventListener(event, dragTask)
		setIsDrag(true)
		console.log('ondown (add ev): ', event)
	}

	const onEndDragHandler = (ev?: SyntheticEvent<HTMLDivElement>) => {
		if (taskListBlock === undefined) return
		taskListBlock.removeEventListener(event, dragTask)
		setIsDrag(false)
		console.log('onup (remove ev): ', event)
		if (initialPos.x === props.data.x || initialPos.y === props.data.y) return
		updateTodo({ id: props.data.id, x: initialPos.x, y: initialPos.y })
	}

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reziseTask = useCallback(throttle((ev: MouseEvent & TouchEvent) => {
    if (initialSizeRef.current === undefined || taskRef.current === null) return
    const width = ev.clientX - taskRef.current.offsetLeft - taskListBlock.scrollLeft - taskListBlock.offsetLeft
    const height = ev.clientY - taskRef.current.offsetTop - taskListBlock.scrollTop - taskListBlock.offsetTop
    if (width > 440 || width < 220) return
    setInitialSize((prev) => ({ ...prev, width: width, height: height }))
  }, 25), [])

	function onResizeHandler(ev: any) {
		taskListBlock.addEventListener(event, reziseTask)
    document.body.style.cursor = 'se-resize'
    setInitialSize((prev) => ({ ...prev, width1: prev.width, height1: prev.height }))
    console.log('ondown (add ev): resize')
	}

	function onEndResizeHandler(ev: MouseEvent) {
		taskListBlock.removeEventListener(event, reziseTask)
    document.body.style.removeProperty("cursor")
    console.log('onup (remove ev): resize')
    updateTodo({ id: props.data.id, width: initialSize.width, height: initialSize.height })
	}

	return (
		<div
			ref={taskRef}
			className={classNames('task', {
				'task-completed': isCompleted && !isEdit,
				'task-deleted': isDeleted,
				'is-dragging': isDrag,
			})}
			style={{
				top: `${initialPosRef.current.y}px`,
				left: `${initialPosRef.current.x}px`,
        width: `${initialSizeRef.current.width}px`,
        height: `${initialSizeRef.current.height}px`,
			}}
		>
			<div
				id='task__draggable-block'
				className='task__draggable-block'
        onTouchEnd={() => onEndDragHandler()}
        onMouseUp={() => onEndDragHandler()}
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
      {
        event === 'mousemove' ? (
          <div
            className='task__resize-block'
            onMouseDown={(ev) => onResizeHandler(ev)}
            onMouseUp={(ev) => onEndResizeHandler(ev)}
          />
        ) : null
      }
		</div>
	)
})
