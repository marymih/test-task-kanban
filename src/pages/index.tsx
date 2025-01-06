import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import {
  updateDocumentStatus,
  addDocument,
  deleteDocument,
} from '../redux/boardSlice';

const Home: React.FC = () => {
  const documents = useSelector((state: RootState) => state.board);
  const dispatch = useDispatch();

  const groupedDocuments = {
    'in-progress': documents.filter((doc) => doc.status === 'in-progress'),
    'under-review': documents.filter((doc) => doc.status === 'under-review'),
    completed: documents.filter((doc) => doc.status === 'completed'),
  };

  const handleAddDocument = () => {
    const newDocument = {
      id: Date.now().toString(),
      title: `Document ${Date.now()}`,
      status: 'in-progress' as const,
    };
    dispatch(addDocument(newDocument));
  };

  const handleDeleteDocument = (id: string) => {
    dispatch(deleteDocument(id));
  };

  const handleMoveDocument = (
    id: string,
    newStatus: 'in-progress' | 'under-review' | 'completed'
  ) => {
    dispatch(updateDocumentStatus({ id, newStatus }));
  };

  return (
    <div>
      <h1>Kanban Board</h1>
      <button onClick={handleAddDocument}>Добавить документ</button>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {Object.entries(groupedDocuments).map(([status, docs]) => (
          <div
            key={status}
            style={{ border: '1px solid black', padding: '10px', width: '30%' }}
          >
            <h2>{status.replace('-', ' ').toUpperCase()}</h2>
            <ul>
              {docs.map((doc) => (
                <li key={doc.id}>
                  {doc.title}
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() =>
                      handleMoveDocument(
                        doc.id,
                        status === 'in-progress' ? 'under-review' : 'completed'
                      )
                    }
                  >
                    Move to{' '}
                    {status === 'in-progress' ? 'Under Review' : 'Completed'}
                  </button>
                  <button
                    style={{ marginLeft: '10px', color: 'red' }}
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
