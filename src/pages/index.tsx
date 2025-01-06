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
    <div className="container">
      <h1 className="text-center my-4">Kanban Board</h1>
      <button className="btn btn-primary mb-4" onClick={handleAddDocument}>
        Add Document
      </button>
      <div className="row">
        {Object.entries(groupedDocuments).map(([status, docs]) => (
          <div key={status} className="col-md-4">
            <div className="card">
              <div className="card-header bg-secondary text-white">
                <h5 className="card-title text-center">
                  {status.replace('-', ' ').toUpperCase()}
                </h5>
              </div>
              <div className="card-body">
                <ul className='list-group'>
                  {docs.map((doc) => (
                    <li key={doc.id} className='list-group-item d-flex justify-content-between align-items-center'>
                      {doc.title}
                      <div>
                        {status !== 'completed' && (
                          <button
                          className='btn btn-sm btn-success me-2'
                          onClick={() =>
                            handleMoveDocument(
                              doc.id,
                              status === 'in-progress'
                                ? 'under-review'
                                : 'completed'
                            )
                          }
                        >
                          Move
                        </button>
                        )}
                      </div>

                      <button
                        className='btn btn-sm btn-danger'
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
