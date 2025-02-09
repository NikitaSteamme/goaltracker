import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './TaskDetails.css';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [name, setName] = useState('');
  const [result, setResult] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [finishCriteria, setFinishCriteria] = useState('');
  const [resources, setResources] = useState('');
  const [startDate, setStartDate] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskName, setSubtaskName] = useState('');
  const [subtaskDueDate, setSubtaskDueDate] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the Authorization header
          }
        });
        const taskData = response.data;
        setTask(taskData);
        setName(taskData.name);
        setResult(taskData.result);
        setFinishDate(taskData.finish_time);
        setFinishCriteria(taskData.finish_criteria);
        setResources(taskData.resources);
        setStartDate(taskData.start_date);
        setSubtasks(taskData.subtasks);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/tasks/${id}`, {
        name,
        result,
        finish_time: finishDate,
        finish_criteria: finishCriteria,
        resources,
        start_date: startDate
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      navigate('/tasks');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubtaskSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/${id}/subtasks/`, {
        name: subtaskName,
        due_date: subtaskDueDate
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      setSubtasks([...subtasks, response.data]);
      setSubtaskName('');
      setSubtaskDueDate('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubtaskDelete = async (subtaskId) => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tasks/${id}/subtasks/${subtaskId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      setSubtasks(subtasks.filter(subtask => subtask.id !== subtaskId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubtaskToggle = async (subtaskId, isCompleted) => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/tasks/${id}/subtasks/${subtaskId}`, {
        is_completed: isCompleted ? 0 : 1
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      setSubtasks(subtasks.map(subtask => subtask.id === subtaskId ? { ...subtask, is_completed: isCompleted ? 0 : 1 } : subtask));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubtaskDueDateChange = async (subtaskId, dueDate) => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/tasks/${id}/subtasks/${subtaskId}`, {
        due_date: dueDate
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      setSubtasks(subtasks.map(subtask => subtask.id === subtaskId ? { ...subtask, due_date: dueDate } : subtask));
    } catch (error) {
      console.error(error);
    }
  };

  const calculateProgress = (task) => {
    const now = new Date();
    const finishTime = new Date(task.finish_time);
    const startTime = new Date(task.start_date);
    const totalTime = finishTime - startTime;
    const elapsedTime = now - startTime;
    const progress = Math.min((elapsedTime / totalTime) * 100, 100);
    return progress;
  };

  const calculateSubtaskPosition = (subtask) => {
    const finishTime = new Date(task.finish_time);
    const startTime = new Date(task.start_date);
    const dueDate = new Date(subtask.due_date);
    const totalTime = finishTime - startTime;
    const elapsedTime = dueDate - startTime;
    const position = Math.min((elapsedTime / totalTime) * 100, 100);
    return position;
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="task-details-container">
      <h2>Task Details</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Task Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Task Name" />
        </label>
        <label>
          Result:
          <input type="text" value={result} onChange={(e) => setResult(e.target.value)} placeholder="Result" />
        </label>
        <label>
          Finish Date:
          <input type="date" value={finishDate} onChange={(e) => setFinishDate(e.target.value)} placeholder="Finish Date" />
        </label>
        <label>
          Finish Criteria:
          <input type="text" value={finishCriteria} onChange={(e) => setFinishCriteria(e.target.value)} placeholder="Finish Criteria" />
        </label>
        <label>
          Resources:
          <input type="text" value={resources} onChange={(e) => setResources(e.target.value)} placeholder="Resources" />
        </label>
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" />
        </label>
        <button type="submit" className="save-button">Save</button>
        <button type="button" className="cancel-button" onClick={() => navigate('/tasks')}>Cancel</button>
      </form>

      <h3>Subtasks</h3>
      <form onSubmit={handleSubtaskSubmit} className="subtask-form">
        <input type="text" value={subtaskName} onChange={(e) => setSubtaskName(e.target.value)} placeholder="New Subtask" />
        <input type="date" value={subtaskDueDate} onChange={(e) => setSubtaskDueDate(e.target.value)} placeholder="Due Date" />
        <button type="submit" className="add-subtask-button">Add Subtask</button>
      </form>
      <ul className="subtask-list">
        {subtasks.map(subtask => (
          <li key={subtask.id} className="subtask-item">
            <span
              className={`subtask-name ${subtask.is_completed ? 'completed' : ''}`}
              onClick={() => handleSubtaskToggle(subtask.id, subtask.is_completed)}
            >
              {subtask.name}
            </span>
            <input
              type="date"
              value={subtask.due_date ? subtask.due_date.split('T')[0] : ''}
              onChange={(e) => handleSubtaskDueDateChange(subtask.id, e.target.value)}
            />
            <button className="delete-subtask-button" onClick={() => handleSubtaskDelete(subtask.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${calculateProgress(task)}%` }}></div>
        {subtasks.map(subtask => (
          <div
            key={subtask.id}
            className="subtask-marker"
            style={{ left: `${calculateSubtaskPosition(subtask)}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default TaskDetails;