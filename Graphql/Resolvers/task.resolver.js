const {
  GraphqlAuthorisationMiddleWare,
} = require("../../Middlewares/auth.middleware");
const {
  AddTaskController,
  UpdateTaskDetailController,
  DeleteTaskController,
} = require("../../Controllers/task.controller");
const ROLES = require("../../Constants/roles.constant");
const {
  AddDependencyController,
} = require("../../Controllers/dependency.controller");
const {
  AddAssignTaskController,
  GetSingleTaskDetailController,
  GetFilterTasksController,
  GetUserDetailAssignTasksController,
  UpdateTaskStatusController,
} = require("../../Controllers/assign.controller");

const memberRoles = [
  [ROLES.ADMIN_ROLE],
  [ROLES.ADMIN_ROLE, ROLES.MANAGER_ROLE, ROLES.TEAM_LEAD, ROLES.MEMBER],
  [ROLES.ADMIN_ROLE, ROLES.MANAGER_ROLE, ROLES.TEAM_LEAD],
  [ROLES.ADMIN_ROLE, ROLES.MANAGER_ROLE],
  [ROLES.MEMBER],
];

const Taskresolvers = {
  Query: {
    GetSingleTaskDetail: GraphqlAuthorisationMiddleWare(...memberRoles[4])(
      GetSingleTaskDetailController
    ),

    GetFilterTasks: GraphqlAuthorisationMiddleWare(...memberRoles[4])(
      GetFilterTasksController
    ),

    GetUserDetailAssignTasks: GraphqlAuthorisationMiddleWare(...memberRoles[2])(
      GetUserDetailAssignTasksController
    ),
  },

  Mutation: {
    addNewTask: GraphqlAuthorisationMiddleWare(...memberRoles[3])(
      AddTaskController
    ),

    updateTaskDetails: GraphqlAuthorisationMiddleWare(...memberRoles[3])(
      UpdateTaskDetailController
    ),

    addDependencyTask: GraphqlAuthorisationMiddleWare(...memberRoles[2])(
      AddDependencyController
    ),

    assignTask: GraphqlAuthorisationMiddleWare(...memberRoles[3])(
      AddAssignTaskController
    ),

    updateTaskStatus: GraphqlAuthorisationMiddleWare(...memberRoles[4])(
      UpdateTaskStatusController
    ),

    deleteTask: GraphqlAuthorisationMiddleWare(ROLES.ADMIN_ROLE)(
      DeleteTaskController
    ),
  },
};

module.exports = Taskresolvers;
