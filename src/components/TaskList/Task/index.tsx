import './style.css'
import './task-text.css'
import { forwardRef, memo, MouseEvent, RefObject, SyntheticEvent, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ITodoResponse } from '../../../types/store/mockApi'
import TaskItem from './Item'
import classNames from 'classnames'
import { useUpdateTodoMutation } from '../../../redux'
import throttle from '../../../utils/throttle'
import { IRemoveListenersHandle } from '../../../types/components/taskList'

type Props = {
	data: ITodoResponse
  tasksRef: RefObject<HTMLDivElement>
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

const Task = forwardRef<IRemoveListenersHandle, Props>(({ data, tasksRef}, ref) => {
	const [initialSize, setInitialSize] = useState<IItitialSize>({
		width: data.width,
		height: data.height,		
    width1: 0,
		height1: 0,
	})
	const maxBlockPosX = 5000
	const maxBlockPosY = 5000
	const [initialPos, setInitialPos] = useState<IItitialPos>({
		x: data.x,
		y: data.y,
		x1: 0,
		y1: 0,
	})
	const [updateTodo] = useUpdateTodoMutation()
	const [isCompleted, setIsCompleted] = useState<boolean>(data.isCompleted)
	const [isDeleted, setIsDeleted] = useState<boolean>(false)
	const [isEdit, setIsEdit] = useState<boolean>(false)
	const [isDrag, setIsDrag] = useState<boolean>(false)
	const [isResize, setIsResize] = useState<boolean>(false)
	const [event, setEvent] = useState<'mousemove' | 'touchmove'>('mousemove')
  const taskRef = useRef<HTMLDivElement>(null)
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
			if (initialPosRef.current === undefined || tasksRef.current === null) return
			let currPosX = 0
			let currPosY = 0
			const currClientX = ev.clientX || ev.targetTouches[0].clientX
			const currClientY = ev.clientY || ev.targetTouches[0].clientY
			const mouseInBlockPosX = Math.ceil(
				currClientX + tasksRef.current.scrollLeft - initialPosRef.current.x1 - tasksRef.current.offsetLeft
			)
			const mouseInBlockPosY = Math.ceil(
				currClientY + tasksRef.current.scrollTop - initialPosRef.current.y1 - tasksRef.current.offsetTop
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
		if (tasksRef.current === null) return
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
		tasksRef.current.addEventListener(event, dragTask)
		setIsDrag(true)
		console.log('ondown (add ev): ', event)
	}

	const onEndDragHandler = (ev?: SyntheticEvent<HTMLDivElement>) => {
		if (tasksRef.current === null || isDrag !== true) return
		setIsDrag(false)
		tasksRef.current.removeEventListener(event, dragTask)
		console.log('onup (remove ev): ', event)
		if (initialPos.x === data.x || initialPos.y === data.y) return
		updateTodo({ id: data.id, x: initialPos.x, y: initialPos.y })
	}

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reziseTask = useCallback(throttle((ev: MouseEvent & TouchEvent) => {
    if (initialSizeRef.current === undefined || taskRef.current === null || tasksRef.current === null) return
    const width = ev.clientX - taskRef.current.offsetLeft - tasksRef.current.scrollLeft - tasksRef.current.offsetLeft
    const height = ev.clientY - taskRef.current.offsetTop - tasksRef.current.scrollTop - tasksRef.current.offsetTop
    if (width > 440 || width < 220) return
    setInitialSize((prev) => ({ ...prev, width: width, height: height }))
  }, 25), [])

	function onResizeHandler(ev: any) {
    if (tasksRef.current === null) return
    tasksRef.current.addEventListener(event, reziseTask)
    setIsResize(true)
    document.body.style.cursor = 'se-resize'
    setInitialSize((prev) => ({ ...prev, width1: prev.width, height1: prev.height }))
    console.log('ondown (add ev): resize')
	}

	function onEndResizeHandler(ev?: MouseEvent) {
    if (isResize !== true || tasksRef.current === null) return
    tasksRef.current.removeEventListener(event, reziseTask)
    setIsResize(false)
    document.body.style.removeProperty("cursor")
    console.log('onup (remove ev): resize')
    updateTodo({ id: data.id, width: initialSize.width, height: initialSize.height })
	}

  function removeListenersHandler() {
    onEndResizeHandler()
    onEndDragHandler()
  }

  useImperativeHandle(ref, () => ({
    removeListeners() {
      removeListenersHandler()
    }
  }))
  
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
				onTouchStart={(ev) => onStartDragHandler(ev as any)}
				onMouseDown={(ev) => onStartDragHandler(ev as any)}
			/>
			<div className='task__wrapper'>
				<TaskItem
					onChangeComplete={(val) => onChangeCompleteHandler(val)}
					onChangeDelete={(val) => onChangeDeleteHandler(val)}
					onChangeEdit={(val) => onChangeEditHandler(val)}
					data={data}
				/>
			</div>
      {
        event === 'mousemove' ? (
          <div
            className='task__resize-block'
            onMouseDown={(ev) => onResizeHandler(ev)}
          />
        ) : null
      }
		</div>
	)
})

export default memo(Task)