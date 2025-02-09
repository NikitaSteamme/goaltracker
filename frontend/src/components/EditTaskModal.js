import React, { useState } from 'react';
import axios from 'axios';
import './EditTaskModal.css';

const EditTaskModal = ({ task, onClose, onUpdate }) => {
  const [name, setName] = useState(task.name);
  const [result, setResult] = useState(task.result);
  const [finishDate, setFinishDate] = useState(task.finish_time);
  const [finishCriteria, setFinishCriteria] = useState(task.finish_criteria);
  const [resources, setResources] = useState(task.resources);
  const [startDate, setStartDate] = useState(task.start_date);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/tasks/${task.id}`, {
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
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Task</h2>
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
          <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;