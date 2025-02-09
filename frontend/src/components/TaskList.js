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

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
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

  const calculateSubtaskPosition = (subtask, task) => {
    const finishTime = new Date(task.finish_time);
    const startTime = new Date(task.start_date);
    const dueDate = new Date(subtask.due_date);
    const totalTime = finishTime - startTime;
    const elapsedTime = dueDate - startTime;
    const position = Math.min((elapsedTime / totalTime) * 100, 100);
    return position;
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
            <th>Finish Date</th>
            <th>Finish Criteria</th>
            <th>Resources</th>
            <th>Start Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <React.Fragment key={task.id}>
              <tr>
                <td><Link to={`/task/${task.id}`}>{task.name}</Link></td>
                <td>{task.result}</td>
                <td>{formatDate(task.finish_time)}</td>
                <td>{task.finish_criteria}</td>
                <td>{task.resources}</td>
                <td>{formatDate(task.start_date)}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(task)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(task.id)}>Delete</button>
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${calculateProgress(task)}%` }}></div>
                    {task.subtasks && task.subtasks.map(subtask => (
                      <div
                        key={subtask.id}
                        className="subtask-marker"
                        style={{ left: `${calculateSubtaskPosition(subtask, task)}%` }}
                      ></div>
                    ))}
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {isModalOpen && <EditTaskModal task={selectedTask} onClose={closeModal} onUpdate={handleUpdate} />}
    </div>
  );
};

export default TaskList;