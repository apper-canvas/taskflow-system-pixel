import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const projectService = {
async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "task_count" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI format
      return response.data.map(project => ({
        id: project.Id.toString(),
        name: project.Name,
        color: project.color || '#5B21B6',
        taskCount: project.task_count || 0,
        createdAt: project.created_at
      }));
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "task_count" } },
          { field: { Name: "created_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById('project', parseInt(id), params);
      
      if (!response.success || !response.data) {
        throw new Error('Project not found');
      }
      
      // Map database fields to UI format
      const project = response.data;
      return {
        id: project.Id.toString(),
        name: project.Name,
        color: project.color || '#5B21B6',
        taskCount: project.task_count || 0,
        createdAt: project.created_at
      };
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }
  },

  async create(projectData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [
          {
            Name: projectData.name,
            color: projectData.color || '#5B21B6',
            task_count: 0,
            created_at: new Date().toISOString()
          }
        ]
      };
      
      const response = await apperClient.createRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} projects:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const project = successfulRecords[0].data;
          return {
            id: project.Id.toString(),
            name: project.Name,
            color: project.color || '#5B21B6',
            taskCount: project.task_count || 0,
            createdAt: project.created_at
          };
        }
      }
      
      throw new Error('Failed to create project');
    } catch (error) {
      console.error("Error creating project:", error);
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
      if (updates.name !== undefined) updateData.Name = updates.name;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.taskCount !== undefined) updateData.task_count = updates.taskCount;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} projects:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const project = successfulRecords[0].data;
          return {
            id: project.Id.toString(),
            name: project.Name,
            color: project.color || '#5B21B6',
            taskCount: project.task_count || 0,
            createdAt: project.created_at
          };
        }
      }
      
      throw new Error('Failed to update project');
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} projects:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete project');
        }
      }
      
      return { id: id };
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  async updateTaskCount(projectId, count) {
    return await this.update(projectId, { taskCount: count });
  },

  async getProjectsWithTaskCounts() {
    // For database implementation, we'll get task counts via aggregators
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color" } },
          { field: { Name: "task_count" } },
          { field: { Name: "created_at" } }
        ],
        aggregators: [
          {
            id: "activeTaskCounts",
            table: { Name: "task" },
            fields: [
              { field: { Name: "Id" }, Function: "Count", Alias: "Count" }
            ],
            where: [
              { FieldName: "completed", Operator: "EqualTo", Values: [false] }
            ]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI format
      return response.data.map(project => ({
        id: project.Id.toString(),
        name: project.Name,
        color: project.color || '#5B21B6',
        taskCount: project.task_count || 0,
        createdAt: project.created_at
      }));
    } catch (error) {
      console.error("Error fetching projects with task counts:", error);
      toast.error("Failed to load projects");
      return [];
    }
  }
};