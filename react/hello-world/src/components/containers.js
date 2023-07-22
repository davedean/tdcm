import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContainerTable = () => {
  const [containers, setContainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingContainer, setProcessingContainer] = useState(null);
  const [action, setAction] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8089/api/containers');
        setContainers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);




  const handleAction = async (action, id) => {
    setProcessingContainer(id);
    setAction(action);
    try {
      await axios.post(`/api/containers/${action}/${id}`);
      const response = await axios.get('/api/containers');
      setContainers(response.data);
    } catch (error) {
      console.error(`Error trying to ${action} container with id ${id}`, error);
    } finally {
      setProcessingContainer(null);
      setAction(null);
    }
  };


  return (
    <div class="container-fluid">
      {isLoading ? (
        <p>Loading containers...</p>
      ) : (
        <div class="table-responsive">
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>State</th>
              <th>Status</th>
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
                <button 
  className="btn btn-primary"
  onClick={() => handleAction('start', container.id)}
  disabled={processingContainer === container.id || container.state === 'running'}
>
  {processingContainer === container.id && action === 'start' ? 'Processing...' : 'Start'}
</button>
</td>
<td>
<button 
  className="btn btn-secondary"
  onClick={() => handleAction('stop', container.id)}
  disabled={processingContainer === container.id || container.state !== 'running'}
>
  {processingContainer === container.id && action === 'stop' ? 'Processing...' : 'Stop'}
</button>
</td>
<td>
<button 
  className="btn btn-danger"
  onClick={() => handleAction('remove', container.id)}
  disabled={processingContainer === container.id || container.state === 'running'}
>
  {processingContainer === container.id && action === 'remove' ? 'Processing...' : 'Remove'}
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default ContainerTable;