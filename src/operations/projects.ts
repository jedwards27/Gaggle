import ProjectStore from "../stores/ProjectStore";
import type { Project } from "../common/types";

export function listProjects(): Project[] {
  return ProjectStore.listProjects();
}

export function addProject(name: string, description = ""): Project {
  return ProjectStore.addProject(name, description);
}

export function getProject(id: string): Project | undefined {
  return ProjectStore.getProject(id);
}

export function updateProject(id: string, updates: Partial<Project>): void {
  ProjectStore.updateProject(id, updates);
}

export function deleteProject(id: string): void {
  ProjectStore.deleteProject(id);
}

export function clearProjects(): void {
  ProjectStore.clearProjects();
}
