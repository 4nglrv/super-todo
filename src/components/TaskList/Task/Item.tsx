import { useEffect, useRef, useState } from 'react'

import { useDeleteTodoMutation, useUpdateTodoMutation } from '../../../redux'
import { ITodoResponse } from '../../../types/store/mockApi'
import CheckIcon from '../../Svg/Check'
import RemoveIcon from '../../Svg/Remove'
import RollingIcon from '../../Svg/Rolling'
import TaskIcon from '../../Svg/Task'

interface Props {
  onChangeComplete: (val: boolean) => void,
  onChangeDelete: (val: boolean) => void,
  onChangeEdit: (val: boolean) => void,
  data: ITodoResponse
}

export default function TaskItem(props: Props) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [ updateTodo, { isLoading } ] = useUpdateTodoMutation()
  const [ deleteTodo ] = useDeleteTodoMutation()
  const [ isCompleted, setIsCompleted ] = useState<boolean>(props.data.isCompleted)
  const [ isEdit, setIsEdit ] = useState<boolean>(false)
  const [ todoText, setTodoText ] = useState<string>(props.data.text)

  async function setCompletedHandler() {
    setIsCompleted(!isCompleted)
    props.onChangeComplete(!isCompleted)
    await updateTodo({ id: props.data.id, isCompleted: !isCompleted }).unwrap()
  }

  const deleteTodoHandler = async () => {
    props.onChangeDelete(true)
    await deleteTodo(props.data.id).unwrap()
  }

  const editTodoHandler = async () => {
    if (isLoading) return
    if (isEdit && props.data.text !== todoText) {
      await updateTodo({ id: props.data.id, text: todoText }).unwrap()
    }
    setIsEdit(!isEdit)
    props.onChangeEdit(!isEdit)
  }

  useEffect(() => {
    if (isEdit && inputRef.current !== null) {
      inputRef.current.focus()
    }
  }, [ isEdit, inputRef ])

  function RenderEditButton() {
    let editBtn
    if (!isEdit) {
      editBtn = <TaskIcon />
    } else if (isLoading) {
      editBtn = <RollingIcon className='update-todo-rolling' />
    } else {
      editBtn = <CheckIcon />
    }
    return editBtn
  }

  function TaskButtons() {
    return (
        <div className='task-buttons'>
          <button 
            onClick={() => editTodoHandler()}
            className='task-btn'
          >
					{ RenderEditButton() }
				</button>

				<button className='task-btn task-remove' onClick={() => deleteTodoHandler()}>
					<RemoveIcon />
				</button>
			</div>
    )
  }

  function RenderTask() {
    let task
    if (!isEdit) {
      task = (
        <div className='task-content' onChange={() => setCompletedHandler()}>
          <div className='task-content__checkbox'>
            <input type='checkbox' defaultChecked={isCompleted} id={props.data.id} name={props.data.id} />
          </div>
          <label dangerouslySetInnerHTML={{ __html: todoText }} className='task-text' htmlFor={props.data.id} />
        </div>
      )
    } else {
      task = (
        <div className='task-text__input-container'>
          <textarea
            disabled={isLoading}
            className='task-text__input'
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' ? editTodoHandler() : ''} 
            ref={inputRef}
          />
        </div>
      )
    }
    return task
  }

  return (
    <>
      { RenderTask() }
      { TaskButtons() }
    </>
  )
} 