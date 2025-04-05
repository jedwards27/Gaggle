import { v4 as uuidv4 } from 'uuid';
import type { Project } from '../common/types';
class ProjectStore {
  private static projects: Project[] = [];

  public static addProject(name: string, description?: string): Project {
    const newProject: Project = {
      id: uuidv4(),
      name,
      description: description || '',
      createdAt: Date.now()
    };
    ProjectStore.projects.push(newProject);
    return newProject;
  }

  public static listProjects(): Project[] {
    return ProjectStore.projects;
  }

  public static getProject(id: string): Project | undefined {
    return ProjectStore.projects.find(p => p.id === id);
  }

  public static updateProject(id: string, updates: Partial<Project>): void {
    ProjectStore.projects = ProjectStore.projects.map((p) => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    });
  }

  public static deleteProject(id: string): void {
    ProjectStore.projects = ProjectStore.projects.filter((p) => p.id !== id);
  }

  public static clearProjects(): void {
    ProjectStore.projects = [];
  }

  public static countProjects(): number {
    return ProjectStore.projects.length;
  }
}

export default ProjectStore;
