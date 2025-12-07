import React from "react";
import { useState } from "react";

export default function App() {
    const [tasks, setTasks] = useState([])

    function submit(newTask){
        setTasks(prev => [...prev, {...newTask}])
    }

    function onCompleted(id){
        setTasks(prev => 
            prev.map(task => task.id === id ? {...task, isComplete: true}: task)
        )
    }
    function onDelete(id){
        setTasks(prev => 
            prev.filter(task => task.id !== id)
        )
    }
    const bgColors = {
        "Низкий": "#d3e9d6",
        "Средний": "#fdf1c9",
        "Высокий": "#f2d3d5"
    }
    return (
        <main className="main">
            <div className="container">
                <ul className="main__list">
                    <li key='task-list' className="main__item">
                        <h1 className="main__title">Новая задача:</h1>
                        <Input fn={submit}/>
                    </li>
                    <li key='tasks' className="main__item">
                        <h2 className="main__title">Задачи:</h2>
                        <div className="main__buttons">
                            <button className="sort-btn ByDate">По дате</button>
                            <button className="sort-btn ByPriority">По приоритету</button>
                        </div>
                        <span className="line"></span>
                        {tasks.length > 0 && (
                            <ul className="main__tasks">
                                {tasks.map(task => !task.isComplete &&
                                (<Task key={task.id} onDelete={onDelete} bgColors={bgColors} onCompleted={onCompleted} id={task.id} taskName={task.title} priority={task.priority} date={task.deadLine}/>)
                                )}
                            </ul>
                        )}
                    </li>
                    <li className="main__item">
                        <h2 className="main__title">Выполненные:</h2>
                        <span className="line"></span>
                        <ul className="main__tasks">
                            {tasks.map(task => task.isComplete &&
                            (<CompleteTask key={task.id} onDelete={onDelete} bgColors={bgColors} id={task.id} taskName={task.title} priority={task.priority} date={task.deadLine}/>)
                            )}
                        </ul>
                    </li>
                </ul>
            </div>
        </main>
    )
}

function Input({fn}){ // форма добавления новой задачи
    const [newTask, setNewTask] = useState({
        priority: 'Низкий',
        isComplete: false,

    })
    const [isOpen, setIsOpen] = useState(false);
    const [id, setId] = useState(1)

    function handle(e){
        e.preventDefault();
        setId(prev => prev + 1)
        const taskWithId = {...newTask, id: id};
        fn(taskWithId);
        console.log(newTask);
    }
    function getDeadLine(e){
        const deadLine = e.target.value;
        const [year, month, date] = deadLine.split("-");
        const formattedDeadLine = `${date}-${month}-${year}`;
        setNewTask(prev => ({...prev, deadLine: formattedDeadLine}));
    }
    return (
        <form onSubmit={handle} className="form">
            <input onChange={(e) => setNewTask(prev => ({...prev, title: e.target.value.trim()}))} type="text" className="form__task" placeholder="Название"/>
            <div className="dropdown-select">
                <button onClick={() => setIsOpen(prev => !prev)} className="dropdown-button" type="button">
                    <span className="dropdown-input">{newTask.priority}</span>
                    <span className="dropdown-input">&#8595;</span>
                </button>
                <ul className={`form__task-priority-lists ${isOpen ? "open": ""}`}>
                    <li onClick={(e) => {
                        {setNewTask(prev => ({...prev, priority: "Средний"}))}
                        {setIsOpen(prev => !prev)}
                    }} className="form__task-priority">Средний</li>
                    <li onClick={(e) => {
                        setNewTask(prev => ({...prev, priority: "Высокий"}))
                        setIsOpen(prev => !prev)
                    }} className="form__task-priority">Высокий</li>
                </ul>
            </div>
            <input onChange={getDeadLine} className="form__datetime" type="date" name="datetime" />
            <button disabled={!newTask.title || !newTask.priority || !newTask.deadLine} className="addTask">Добавить</button>
        </form>
    )
}

function Task({taskName, priority, date, id, onCompleted, bgColors, onDelete}){ // Независимый компонент для рендера задачи
    return (
        <li className="task-item" style={{backgroundColor: bgColors[priority]}}>
            <div className="task__wrapper">
                <h3 className="task__title">#{id} {taskName} - {priority}</h3>
                <p className="task__deadLine">Выполнить до: {date}</p>
            </div>
            <div className="task__wrapper btns">
                <button onClick={() => onCompleted(id)} className="task__btn green">Готово</button>
                <button onClick={() => onDelete(id)} className="task__btn red">Удалить</button>
            </div>
        </li>
    )
}

function CompleteTask({taskName, priority, date, id, bgColors, onDelete}){ // Независимый компонент для рендера задачи
    return (
        <li className="task-item" style={{backgroundColor: bgColors[priority]}}>
            <div className="task__wrapper">
                <h3 className="task__title">#{id} {taskName} - {priority}</h3>
                <p className="task__deadLine">Выполнить до: {date}</p>
            </div>
            <div className="task__wrapper btns">
                <button onClick={() => onDelete(id)} className="task__btn red">Удалить</button>
            </div>
        </li>
    )
}