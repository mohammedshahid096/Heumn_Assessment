const gql = require("graphql-tag");

const TaskTypeDef = gql`
  scalar timestamptz
  scalar MongoID

  type Query {
    GetSingleTaskDetail(taskId: String!): TaskDetailResponse

    GetUserDetailAssignTasks: [GetUserDetailAssignTasksResponse]

    GetFilterTasks(
      status: String
      dueDate: String
      name: String
    ): [GetFilterTasksResponse]
  }

  type Task {
    _id: MongoID
    title: String
    description: String
    startDate: timestamptz
    dueDate: timestamptz
    createdBy: MongoID
    parentTaskId: MongoID
    createdAt: timestamptz
    updatedAt: timestamptz
  }

  type User_Task {
    _id: MongoID
    taskId: MongoID
    userId: MongoID
    statusId: MongoID
  }

  type Version {
    _id: MongoID
    taskId: MongoID
    userId: MongoID
    statusId: MongoID
    updatedBy: MongoID
  }

  type Dependency {
    taskId: MongoID
    dependentTaskId: MongoID
    createdAt: timestamptz
    updatedAt: timestamptz
  }

  type UpdateTask {
    userTask: User_Task
    version: Version
  }

  type TaskDetailResponse {
    TaskDetail: Task!
    SubTasks: [Task]!
    Dependencies: [Dependency]!
  }

  type GetUserDetailAssignTasksResponse {
    _id: MongoID
    name: String
    email: String
    userid: MongoID
    tasks: [Task]
  }

  type GetFilterTasksResponse {
    name: String
    userId: String
    taskId: String
    taskName: String
    parentTaskId: MongoID
    dueDate: timestamptz
    status: String
  }

  type SimpleResponse {
    success: Boolean
    message: String
  }

  type Mutation {
    addNewTask(
      title: String!
      description: String
      status: String
      dueDate: String!
      parentId: String
    ): Task

    deleteTask(taskid: String!): SimpleResponse

    assignTask(taskId: String!, userId: String!, leadTaskId: String): User_Task

    updateTaskDetails(
      taskid: String!
      title: String
      description: String
      dueDate: String
      leadTaskId: String
    ): Task

    updateTaskStatus(
      assignedId: String
      status: String!
      userId: String
      leadProjectId: String
    ): UpdateTask

    TestMiddleWare(id: String): String

    addDependencyTask(taskId: String!, dependentTaskId: String!): Dependency
  }
`;

module.exports = TaskTypeDef;
