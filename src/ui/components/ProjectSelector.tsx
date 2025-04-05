import { useState } from 'react';
import { addProject } from '../../operations/projects';
import { client } from '../../client';
import type { Project } from '../../common/types';

export default function ProjectSelector({ projects }: { projects: Project[] }) {
  const [activeProject, setLocalActiveProject] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalProjectName, setModalProjectName] = useState('');


  const handleSelectProject = (id: string) => {
    setLocalActiveProject(id);
  };

  const openModal = () => {
    setModalProjectName('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCreateProjectFromModal = async () => {
    if (!modalProjectName.trim()) return;
    await client.callTool({
      name: 'add_project',
      arguments: {
        name: modalProjectName.trim(),
      }
    });

    addProject(modalProjectName.trim());
    setModalProjectName('');
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ margin: 0 }}>Projects</h3>
        <button onClick={openModal} style={{ marginLeft: '12px', borderRadius: '50%', width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          +
        </button>
      </div>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <button onClick={() => handleSelectProject(project.id)}>
              {project.name}
              {activeProject && activeProject.id === project.id && ' (Active)'}
            </button>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create a New Project</h2>
            <input
              type="text"
              placeholder="Project Name"
              value={modalProjectName}
              onChange={(e) => setModalProjectName(e.target.value)}
              style={{ 
                padding: '8px', 
                marginBottom: '12px', 
                width: '100%',
                boxSizing: 'border-box' 
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={closeModal}>Cancel</button>
              <button onClick={handleCreateProjectFromModal}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
