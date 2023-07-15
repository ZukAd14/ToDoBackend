import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import shortid from 'shortid';



const App = () => {
  
  const [connection, setConnection] = useState('http://localhost:8000/');
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const newSocket = io(connection);
    setSocket(newSocket);

    newSocket.on('addTask', (task) => addTask(task))
    newSocket.on('removeTask', (id) => removeTask(id));
    newSocket.on('updateData', (data) => updateTasks(data))
  }, []);
 
  

  const removeTaskLocal = (id) => {
    removeTask(id);
    socket.emit('removeTask', id);
  }
  const removeTask = (id) => {
        setTasks(tasks => tasks.filter(task => task.id !== id));
    }
  
  const submitForm = (event) => {
    event.preventDefault();
    const task = { name: taskName, id: shortid() }
    addTask(task);
    socket.emit('addTask', task)
    setTaskName('');
  }

  const addTask = (task) => {
       setTasks(tasks => [...tasks, task]);
  }

  const updateTasks = (data) => {

    setTasks(data);
    
    console.log('data: ', data)
  }

console.log('taski: ', tasks);

  return (
    <div className="App">

    <header>
      <h1>ToDoList.app</h1>
    </header>

    <section className="tasks-section" id="tasks-section">
      <h2>Tasks</h2>

      <ul className="tasks-section__list" id="tasks-list">
        {
          tasks.map(task => (
            <li
            key={task.id}
            className='task'
            >
              {task.name}
              <button className='btn btn--red' onClick={() => removeTaskLocal(task.id)}>Remove</button>
              </li>
            
          ))
        }
      </ul>

      <form id="add-task-form" onSubmit={submitForm}>
        <input 
        className="text-input" 
        autoComplete="off" 
        type="text" 
        placeholder="Type your description" 
        id="task-name" 
        value={taskName}
        onChange={e => setTaskName(e.target.value)}
        />
        <button className="btn" type="submit">Add</button>
      </form>

    </section>
  </div>
  );
}

export default App;