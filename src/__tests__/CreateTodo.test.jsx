import { render, fireEvent, screen, waitFor } from '@testing-library/react'

import '@testing-library/jest-dom'
import { Provider } from 'react-redux'

import CreateTodo from '../components/CreateTodo'
import { store } from '../redux'

function renderComponent() {
  return (
    render(
      <Provider store={store}> 
        <CreateTodo />
      </Provider>
    )
  )
}

test('text length alert', async () => {
  window.alert = jest.fn()
  renderComponent()

  const inputField = await screen.findByPlaceholderText('Добавить новую задачу')
  const btn = await screen.findByText('Создать')
  fireEvent.change(inputField, { target: { value: '123' } })
  fireEvent.click(btn)
  expect(window.alert).toHaveBeenCalledWith('Необходимо ввести больше 3 символов')
})

test('clear input after create todo', async () => {
  renderComponent()

  const inputField = await screen.findByPlaceholderText('Добавить новую задачу')
  const btn = await screen.findByText('Создать')
  fireEvent.change(inputField, { target: { value: `Проверка создания записи ${Date.now()}` } })
  fireEvent.click(btn)
  await waitFor(() => expect(inputField).toHaveValue(''), { timeout: 5000 })
})