import React, {useState}  from 'react';
import cn from 'classnames';
import { getHighlightedText } from '../../utils'

export default function Todo({todo, editTodo, index, completedTodo, removeTodo, filterString}) {
    const [newText, setNewText] = useState(todo.text);
    const [isEdit, setIsEdit] = useState(false);

    const className = cn({
        row: true,
        flex: true,
        'todos-item': true,
        completed: todo.completed,
    });

    if(filterString && !todo.text.includes(filterString)) {
        return null;
    }

    const highlightedText = getHighlightedText(todo.text, filterString);

    const handleSave = () => {
        editTodo(todo._id, newText);
        setIsEdit(false)
    };
    const handleEdit = () => {
        setIsEdit(true)
    };

    return (
        <div className={className} >
            <div className="col todos-num">{index + 1}</div>
            {isEdit ? <input defaultValue={todo.text}  type="text" onChange={e => setNewText(e.target.value)} /> : <div className="col todos-text">{highlightedText}</div> }
            
            <div className="col todos-buttons">
                {isEdit ? (
                        <i className="material-icons pink-text" onClick={handleSave}>save</i>
                    ) : (
                        <i className="material-icons green-text" onClick={handleEdit}>edit</i>
                    )}
                <i className="material-icons blue-text" onClick={() => completedTodo(todo._id)}>check</i>
                <i className="material-icons red-text" onClick={() => removeTodo(todo._id)}>delete</i>
            </div>
        </div>
  )
};
