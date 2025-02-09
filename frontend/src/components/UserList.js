import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TaskList.css';
import EditTaskModal from './EditTaskModal';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tasks/`, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (taskId) => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleUpdate = () => {
    fetchTasks();
    closeModal();
  };

  const calculateProgress = (task) => {
    const totalDuration = task.duration;
    const elapsedTime = new Date() - new Date(task.start_time); // Assuming `start_time` is a field in the task
    const progress = Math.min((elapsedTime / totalDuration) * 100, 100);
    return progress;
  };

  return (
    <div className="task-list-container">
      <h1 className="task-list-title">Task List</h1>
      <Link to="/task/new" className="create-task-link">Create Task</Link>
      <table className="task-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Result</th>
            <th>Duration</th>
            <th>Finish Time</th>
            <th>Finish Criteria</th>
            <th>Resources</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>{task.result}</td>
              <td>{task.duration}</td>
              <td>{task.finish_time}</td>
              <td>{task.finish_criteria}</td>
              <td>{task.resources}</td>
              <td>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${calculateProgress(task)}%` }}></div>
                </div>
              </td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(task)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && <EditTaskModal task={selectedTask} onClose={closeModal} onUpdate={handleUpdate} />}
    </div>
  );
};

export default TaskList;