import React, {useState, useContext, useCallback, useEffect} from 'react';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext';
import './TodoPage.css';
import Todo from '../../components/Todo/Todo';

const TodoPage = () => {
    const [text, setText] = useState('');
    const {userId} = useContext(AuthContext);
    const [todos, setTodos] = useState([]);
    const [filterString, setFilterString] = useState();

    const getTodo = useCallback(async () => {
        try {
            const {data} = await axios.get('/api/todo', {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {userId}
            })
            setTodos(data)
        } catch (error) {
            console.log(error)
        }
    }, [userId])

    const createTodo = useCallback(async () => {
        if(!text) return null
        try {
            const {data} =  await axios.post('/api/todo/add', {text, userId}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            setTodos(data);
            setText('');

        } catch (error) {
            console.log(error)
        }
    }, [text, userId])


    const removeTodo = useCallback(async (id) => {
        try {   
            const {data} = await axios.delete(`/api/todo/delete/${id}`, {id}, {
                headers: {'Content-Type': 'application/json'}
            })
            setTodos(data)
            
        } catch (error) {
            console.log(error)
        }
    }, [])

    const completedTodo = useCallback(async (id) => {
        try {
            const {data} = await axios.put(`/api/todo/complete/${id}`, {id}, {
                headers: {'Content-Type': 'application/json'}
            })
            setTodos(data);
        } catch (error) {
            console.log(error)
        }
    }, [])

    const editTodo = useCallback(async (id, newText) => {
        try {
            const {data} = await axios.put(`/api/todo/edit/${id}`, {id, newText}, {
                headers: {'Content-Type': 'application/json'}
            })
            setTodos(data)
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        getTodo()
    }, [getTodo])

    return (
        <div className="container">
            <div className="main-page">
                <h4>Add task:</h4>
                <div className="row">
                    <div className="col s12">
                        <label htmlFor="input">Task:</label>
                        <input 
                            type="text"
                            id="text"
                            name="input"
                            className="validate"
                            value={text}
                            onChange={e => setText(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <button
                        className="waves-effect waves-light btn blue"
                        onClick={createTodo}
                    >Add</button>
                </div>
                <div className="row">
                    <div className="col s12">
                            <label htmlFor="input">Filter:</label>
                            <input 
                                type="text"
                                className="filter"
                                value={filterString}
                                onChange={e => setFilterString(e.target.value)}
                            />
                        </div>
                </div>

                <h3>{filterString ? 'Filtered' : 'All'} tasks:</h3>

                <div className="todos">
                   {
                       todos.map((todo, index) => (
                            <Todo 
                                key={todo._id}
                                index={index}
                                todo={todo}
                                editTodo={editTodo}
                                completedTodo={completedTodo}
                                removeTodo={removeTodo}
                                filterString={filterString}
                           />)
                        )
                   }
                </div>
            </div>
        </div>
    )
}

export default TodoPage
