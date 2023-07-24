import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { EjectFill, PlayFill, StopFill, Trash2Fill   } from 'react-bootstrap-icons';



const ContainerTable = ({ containers, setContainers }) => {
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [buttonSize, setButtonSize] = useState('20'); // default size

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentContainer, setCurrentContainer] = useState(null);


  const handleClose = () => setShowModal(false);
  const handleShow = (containerId) => {
    setSelectedContainer(containerId);
    setShowModal(true);
  };

  const handleStart = async (containerId) => {
    try {
      const response = await axios.post(`/api/containers/start/${containerId}`);
      if (response.status === 200) {
        setContainers(containers.map(container =>
          container.id === containerId ? { ...container, state: 'running' } : container
        ));
      }
    } catch (error) {
      console.error("Error starting container", error);
    }
  };

  const handleStop = async (containerId) => {
    try {
      const response = await axios.post(`/api/containers/stop/${containerId}`);
      if (response.status === 200) {
        setContainers(containers.map(container =>
          container.id === containerId ? { ...container, state: 'stopped' } : container
        ));
      }
    } catch (error) {
      console.error("Error stopping container", error);
    }
  };

  const openDetailModal = (container) => {
    setCurrentContainer(container);
    setShowDetailModal(true);
  };
  
  const closeDetailModal = () => {
    setShowDetailModal(false);
  };
  

  const handleRemove = async () => {
    try {
      const response = await axios.post(`/api/containers/remove/${selectedContainer}`);
      if (response.status === 200) {
        setSelectedContainer(null);
        setShowModal(false);
        setContainers(containers.filter(container => container.id !== selectedContainer));
      }
    } catch (error) {
      console.error("Error removing container", error);
    }
  };

  return (
    <div>
      <table className="table" class="table table-responsive table-striped">
        <thead>
          <tr>
            <th>Start/Stop</th>
            <th>Name</th>
            <th>Image</th>
            <th>Port</th>
            <th>Status</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((container) => (
            <tr key={container.id}>
              <td>
              { container.state === "running" && (
                   <Button title="stop" variant="secondary" size="sm" disabled={container.state !== 'running'} onClick={() => handleStop(container.id)}><StopFill size={buttonSize} /></Button> 
                   ) }
              { container.state !== "running" && (
                <Button title="start" variant="primary" size="sm" disabled={container.state === 'running'} onClick={() => handleStart(container.id)}><PlayFill size={buttonSize}/> </Button>
              ) }
              </td>
              <td class="text-decoration-underline" onClick={() => openDetailModal(container)}>{container.name}</td>
              <td>{container.image.substring(0,26)}</td>
              <td>  
                {container.ports && container.ports.length > 0 && container.ports.map((port, index) =>
                  port !== 0 
                    ? <span key={index}>
                      <a href={`http://${window.location.hostname}:${port}`} target="_blank" rel="noopener noreferrer">
                        {port}
                      </a>{index < container.ports.length - 1 ? ', ' : ''}
                      </span> 
                    : null )}
                </td>
              <td>{container.status}</td>
              <td>              
                { container.state !== "running" && (
                <Button title="remove" variant="danger" size="sm" disabled={container.state === 'running'} onClick={() => handleShow(container.id)}><Trash2Fill size={buttonSize}/></Button>
                ) } 
                </td>
            </tr>
          ))}
        </tbody>
      </table>

<Modal show={showDetailModal} onHide={closeDetailModal}>
  <Modal.Header closeButton>
    <Modal.Title>Container Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {currentContainer && 
      <div>
        <p>Name: {currentContainer.name}</p>
        <p>Id: {currentContainer.id.substring(0,16) }</p>
        <p>Image: {currentContainer.image}</p>
        <p>Ports: 
        {currentContainer.ports && currentContainer.ports.length > 0 && currentContainer.ports.map((port, index) =>
                  port !== 0 
                    ? <span key={index}>
                      <a href={`http://${window.location.hostname}:${port}`} target="_blank" rel="noopener noreferrer">
                        {port}
                      </a>{index < currentContainer.ports.length - 1 ? ', ' : ''}
                      </span> 
                    : null )}
        </p>
        <p>State: {currentContainer.state}</p>
        <p>Status: {currentContainer.status}</p>
        {/* Add any other details you want to display */}
      </div>
    }
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={closeDetailModal}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this container?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRemove}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContainerTable;
