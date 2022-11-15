export enum SocketEventsEnum {
  boardsJoin = 'boards:join',
  boardsLeave = 'boards:leave',


  columnsCreate = 'columns:create',
  columnsCreated = 'columns:created',
  columnsNotCreated = 'columns:notCreated',


  tasksCreate = 'tasks:create',
  tasksCreated = 'tasks:created',
  tasksNotCreated = 'tasks:notCreated',


  boardsUpdate = 'boards:update',
  boardsUpdated = 'boards:updated',
  boardsNotUpdated = 'boards:notUpdated',


  boardsDelete= 'boards:delete',
  boardsDeleted = 'boards:deleted',
  boardsNotDeleted = 'boards:notDeleted',


  columnsDelete= 'columns:delete',
  columnsDeleted = 'columns:deleted',
  columnsNotDeleted = 'columns:notDeleted',


  tasksDelete= 'tasks:update',
  tasksDeleted = 'tasks:updated',
  tasksNotDeleted = 'tasks:notUpdate',

  tasksUpdate = 'tasks:create',
  tasksUpdated = 'tasks:created',
  tasksNotUpdated = 'tasks:notCreated',


}
