import express from 'express';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import taskController from '../../controllers/tasks.controller.js';
import userFileUploadMiddleware from '../../middlewares/fileUpload.js';
import convertHeicToPngMiddleware from '../../middlewares/converter.js';

const UPLOADS_FOLDER_SUBMIT_TASK = "./public/uploads/submitTask";
const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_SUBMIT_TASK);

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management and assignment endpoints
 */

/**
 * @swagger
 * /v1/tasks/service:
 *   get:
 *     summary: Get service list for home
 *     description: Retrieve list of available services for clients.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.route("/service").get(auth("client"), taskController.homeServiceList);

/**
 * @swagger
 * /v1/tasks/admin:
 *   get:
 *     summary: Get admin tasks
 *     description: Retrieve all tasks for admin dashboard.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of tasks per page
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
router.route("/admin").get(auth("admin"), taskController.getAdminTasks);

/**
 * @swagger
 * /v1/tasks/home:
 *   get:
 *     summary: Get employee task home
 *     description: Retrieve task home page data for employees.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.route("/home").get(auth("employee"), taskController.taskHome);

/**
 * @swagger
 * /v1/tasks/register/admin:
 *   get:
 *     summary: Get submitted tasks
 *     description: Retrieve list of all submitted tasks for review.
 *     tags: [Tasks]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.route("/register/admin").get(taskController.getSubmittedTasks);

/**
 * @swagger
 * /v1/tasks/register/single:
 *   get:
 *     summary: Get single registered task
 *     description: Retrieve details of a single registered task.
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route("/register/single").get(taskController.getRegisterSingleTask);

/**
 * @swagger
 * /v1/tasks/register:
 *   post:
 *     summary: Register for a task
 *     description: Employee can register for an available task.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *             properties:
 *               taskId:
 *                 type: string
 *                 description: ID of the task to register for
 *     responses:
 *       "201":
 *         description: Task registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   get:
 *     summary: Get employee tasks
 *     description: Retrieve all tasks for the authenticated employee.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *   patch:
 *     summary: Submit task completion
 *     description: Employee can submit completed task with images.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *             properties:
 *               taskId:
 *                 type: string
 *                 description: ID of the task being submitted
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Proof of completion images (HEIC files will be converted to PNG)
 *               notes:
 *                 type: string
 *                 description: Additional notes about task completion
 *     responses:
 *       "200":
 *         description: Task submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update submitted task
 *     description: Update details of a submitted task.
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *             properties:
 *               taskId:
 *                 type: string
 *                 description: ID of the task to update
 *               status:
 *                 type: string
 *                 description: New task status
 *     responses:
 *       "200":
 *         description: Task updated successfully
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route("/register")
  .post(auth("employee"), taskController.taskRegister)
  .get(auth("employee"), taskController.getEmployeeTasks)
  .patch(
    auth("employee"),
    [uploadUsers.array("image")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_SUBMIT_TASK),
    taskController.taskSubmit
  )
  .put(taskController.submitTaskUpdate);

/**
 * @swagger
 * /v1/tasks:
 *   post:
 *     summary: Create a new task
 *     description: Clients can create new tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Task title
 *               description:
 *                 type: string
 *                 description: Detailed task description
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: Task deadline
 *               budget:
 *                 type: number
 *                 description: Task budget
 *     responses:
 *       "201":
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get client tasks
 *     description: Retrieve all tasks created by the authenticated client.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Maximum number of tasks per page
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router
  .route("/")
  .post(auth("client"), taskController.createTask)
  .get(auth("client"), taskController.getTasks);

/**
 * @swagger
 * /v1/tasks/{taskId}:
 *   get:
 *     summary: Get task by ID
 *     description: Retrieve details of a specific task.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route("/:taskId").get(auth("common"), taskController.getTask);

export default router;
