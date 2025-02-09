import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TaskForm.css';

const TaskForm = () => {
  const [name, setName] = useState('');
  const [result, setResult] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [finishCriteria, setFinishCriteria] = useState('');
  const [resources, setResources] = useState('');
  const [startDate, setStartDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/`, {
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
      navigate('/tasks'); // Redirect to the /tasks page on successful task creation
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Task Name" />
      <input type="text" value={result} onChange={(e) => setResult(e.target.value)} placeholder="Result" />
      <input type="date" value={finishDate} onChange={(e) => setFinishDate(e.target.value)} placeholder="Finish Date" />
      <input type="text" value={finishCriteria} onChange={(e) => setFinishCriteria(e.target.value)} placeholder="Finish Criteria" />
      <input type="text" value={resources} onChange={(e) => setResources(e.target.value)} placeholder="Resources" />
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" />
      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;