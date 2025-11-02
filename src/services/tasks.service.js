import httpStatus from 'http-status';
import { Tasks } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

/**
 * Create a task
 * @param {Object} taskBody
 * @returns {Promise<Tasks>}
 */
const createTask = async (taskBody) => {
  return Tasks.create(taskBody);
};

/**
 * Query for tasks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryTasks = async (filter, options) => {
  const tasks = await Tasks.paginate(filter, options);
  return tasks;
};

/**
 * Get task by id
 * @param {ObjectId} id
 * @returns {Promise<Tasks>}
 */
const getTaskById = async (id) => {
  return Tasks.findById(id);
};

/**
 * Get tasks assigned to user
 * @param {ObjectId} userId
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getTasksByAssignee = async (userId, options) => {
  return Tasks.paginate({ assignedTo: userId }, options);
};

/**
 * Update task by id
 * @param {ObjectId} taskId
 * @param {Object} updateBody
 * @returns {Promise<Tasks>}
 */
const updateTaskById = async (taskId, updateBody) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  Object.assign(task, updateBody);
  await task.save();
  return task;
};

/**
 * Delete task by id
 * @param {ObjectId} taskId
 * @returns {Promise<Tasks>}
 */
const deleteTaskById = async (taskId) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  await task.remove();
  return task;
};

export default {
  createTask,
  queryTasks,
  getTaskById,
  getTasksByAssignee,
  updateTaskById,
  deleteTaskById,
};
