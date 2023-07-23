import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ContainerTable = ({ containers, setContainers }) => {
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>State</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((container) => (
            <tr key={container.id}>
              <td>{container.id}</td>
              <td>{container.image}</td>
              <td>{container.state}</td>
              <td>{container.status}</td>
              <td>
                <Button variant="primary" size="sm" disabled={container.state === 'running'} onClick={() => handleStart(container.id)}>Start</Button>{' '}
                <Button variant="secondary" size="sm" disabled={container.state !== 'running'} onClick={() => handleStop(container.id)}>Stop</Button>{' '}
                <Button variant="danger" size="sm" disabled={container.state === 'running'} onClick={() => handleShow(container.id)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
