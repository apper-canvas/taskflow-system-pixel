import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "project_id" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI format
      return response.data.map(task => ({
        id: task.Id.toString(),
        title: task.title,
        completed: task.completed,
        projectId: task.project_id ? task.project_id.toString() : null,
        dueDate: task.due_date,
        priority: task.priority,
        createdAt: task.created_at,
        completedAt: task.completed_at
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "project_id" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error('Task not found');
      }
      
      // Map database fields to UI format
      const task = response.data;
      return {
        id: task.Id.toString(),
        title: task.title,
        completed: task.completed,
        projectId: task.project_id ? task.project_id.toString() : null,
        dueDate: task.due_date,
        priority: task.priority,
        createdAt: task.created_at,
        completedAt: task.completed_at
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [
          {
            title: taskData.title,
            completed: false,
            project_id: taskData.projectId ? parseInt(taskData.projectId) : null,
            due_date: taskData.dueDate,
            priority: taskData.priority || 3,
            created_at: new Date().toISOString(),
            completed_at: null
          }
        ]
      };
      
      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            id: task.Id.toString(),
            title: task.title,
            completed: task.completed,
            projectId: task.project_id ? task.project_id.toString() : null,
            dueDate: task.due_date,
            priority: task.priority,
            createdAt: task.created_at,
            completedAt: task.completed_at
          };
        }
      }
      
      throw new Error('Failed to create task');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      const updateData = {
        Id: parseInt(id)
      };
      
      // Map UI fields to database fields (only updateable fields)
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.completed !== undefined) {
        updateData.completed = updates.completed;
        updateData.completed_at = updates.completed ? new Date().toISOString() : null;
      }
      if (updates.projectId !== undefined) updateData.project_id = updates.projectId ? parseInt(updates.projectId) : null;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            id: task.Id.toString(),
            title: task.title,
            completed: task.completed,
            projectId: task.project_id ? task.project_id.toString() : null,
            dueDate: task.due_date,
            priority: task.priority,
            createdAt: task.created_at,
            completedAt: task.completed_at
          };
        }
      }
      
      throw new Error('Failed to update task');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} tasks:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete task');
        }
      }
      
      return { id: id };
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  async getByProject(projectId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "project_id" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } }
        ],
        where: [
          { FieldName: "project_id", Operator: "EqualTo", Values: [parseInt(projectId)] }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI format
      return response.data.map(task => ({
        id: task.Id.toString(),
        title: task.title,
        completed: task.completed,
        projectId: task.project_id ? task.project_id.toString() : null,
        dueDate: task.due_date,
        priority: task.priority,
        createdAt: task.created_at,
        completedAt: task.completed_at
      }));
    } catch (error) {
      console.error("Error fetching tasks by project:", error);
      toast.error("Failed to load project tasks");
      return [];
    }
  },

  async getOverdue() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "project_id" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  { fieldName: "completed", operator: "EqualTo", values: [false] }
                ]
              },
              {
                conditions: [
                  { fieldName: "due_date", operator: "LessThan", values: [new Date().toISOString()] }
                ]
              }
            ]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI format
      return response.data.map(task => ({
        id: task.Id.toString(),
        title: task.title,
        completed: task.completed,
        projectId: task.project_id ? task.project_id.toString() : null,
        dueDate: task.due_date,
        priority: task.priority,
        createdAt: task.created_at,
        completedAt: task.completed_at
      }));
    } catch (error) {
      console.error("Error fetching overdue tasks:", error);
      toast.error("Failed to load overdue tasks");
      return [];
    }
  },

  async getToday() {
    try {
      const apperClient = getApperClient();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const params = {
        fields: [
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "project_id" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  { fieldName: "due_date", operator: "GreaterThanOrEqualTo", values: [today.toISOString()] }
                ]
              },
              {
                conditions: [
                  { fieldName: "due_date", operator: "LessThan", values: [tomorrow.toISOString()] }
                ]
              }
            ]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI format
      return response.data.map(task => ({
        id: task.Id.toString(),
        title: task.title,
        completed: task.completed,
        projectId: task.project_id ? task.project_id.toString() : null,
        dueDate: task.due_date,
        priority: task.priority,
        createdAt: task.created_at,
        completedAt: task.completed_at
      }));
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      toast.error("Failed to load today's tasks");
      return [];
    }
  },

  async bulkUpdate(taskIds, updates) {
    try {
      const records = taskIds.map(id => {
        const updateData = { Id: parseInt(id) };
        
        // Map UI fields to database fields (only updateable fields)
        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.completed !== undefined) {
          updateData.completed = updates.completed;
          updateData.completed_at = updates.completed ? new Date().toISOString() : null;
        }
        if (updates.projectId !== undefined) updateData.project_id = updates.projectId ? parseInt(updates.projectId) : null;
        if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
        if (updates.priority !== undefined) updateData.priority = updates.priority;
        
        return updateData;
      });
      
      const apperClient = getApperClient();
      const params = { records };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      const updatedTasks = [];
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        successfulRecords.forEach(result => {
          const task = result.data;
          updatedTasks.push({
            id: task.Id.toString(),
            title: task.title,
            completed: task.completed,
            projectId: task.project_id ? task.project_id.toString() : null,
            dueDate: task.due_date,
            priority: task.priority,
            createdAt: task.created_at,
            completedAt: task.completed_at
          });
        });
      }
      
      return updatedTasks;
    } catch (error) {
      console.error("Error bulk updating tasks:", error);
      throw error;
    }
  },

  async reorderTasks(taskIds) {
    try {
      const records = taskIds.map((id, index) => ({
        Id: parseInt(id),
        priority: index + 1
      }));
      
      const apperClient = getApperClient();
      const params = { records };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      const reorderedTasks = [];
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to reorder ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        successfulRecords.forEach(result => {
          const task = result.data;
          reorderedTasks.push({
            id: task.Id.toString(),
            title: task.title,
            completed: task.completed,
            projectId: task.project_id ? task.project_id.toString() : null,
            dueDate: task.due_date,
            priority: task.priority,
            createdAt: task.created_at,
            completedAt: task.completed_at
          });
        });
      }
      
      return reorderedTasks;
    } catch (error) {
      console.error("Error reordering tasks:", error);
      throw error;
    }
  }
};