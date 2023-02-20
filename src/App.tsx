import './App.css'
import CreateTodo from './components/CreateTodo'
import TaskList from './components/TaskList'

const App = () => {
  return (
    <div className="App">
      <div className="container">
        <div className="header-bg" />
        <header>
          <h1 className="header">
            <img className="header-logo" src="/assets/todo-logo.svg" alt="logo"></img>
            to
            <span className="header__purple">do</span>
          </h1>
        </header>

        <main className='main'>
          <CreateTodo />
          <TaskList />
        </main>

      </div>
    </div>
  )
}

export default App