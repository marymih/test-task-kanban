import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RootState } from '../redux/store';
import {
  updateDocumentStatus,
  addDocument,
  deleteDocument,
} from '../redux/boardSlice';

const ITEM_TYPE = 'CARD';

interface Document {
  id: string;
  title: string;
  status: 'in-progress' | 'under-review' | 'completed';
}

const Card: React.FC<{ document: Document }> = ({ document}) => {
  const [, dragRef] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: document.id, status: document.status },
  }));

  const dispatch = useDispatch();

  const handleDeleteDocument = (id: string) => {
    dispatch(deleteDocument(id));
  };

  return (
    <li ref={dragRef}
      className="list-group-item d-flex justify-content-between align-items-center">
      {document.title}
      <button className='btn btn-sm btn-danger' onClick={() => handleDeleteDocument(document.id)}>Delete</button>
    </li>
  );
}

const Column: React.FC<{
  status: Document['status'];
  documents: Document[];
}> = ({ status, documents }) => {
  const dispatch = useDispatch();

  const [, dropRef] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { id: string; status: string }) => {
      if (item.status !== status) {
        dispatch(updateDocumentStatus({ id: item.id, newStatus: status }));
      }
    },
  }));

  return (
    <div ref={dropRef} className="card">
      <div className="card-header bg-secondary text-white">
        <h5 className="card-title text-center">
          {status.replace('-', ' ').toUpperCase()}
        </h5>
      </div>
      <div className="card-body">
        <ul className='list-group'>
          {documents.map((doc) => (
            <Card key={doc.id} document={doc} />
          ))}
        </ul>
      </div>
    </div>
  )
}

const Home: React.FC = () => {
  const documents = useSelector((state: RootState) => state.board);
  const dispatch = useDispatch();

  const [newTitle, setNewTitle] = useState('');

  const groupedDocuments = {
    'in-progress': documents.filter((doc) => doc.status === 'in-progress'),
    'under-review': documents.filter((doc) => doc.status === 'under-review'),
    'completed': documents.filter((doc) => doc.status === 'completed'),
  };

  const handleAddDocument = () => {
    if (newTitle.trim() === '') {
      alert('Please enter a title for the document');
      return;
    }
    const newDocument = {
      id: Date.now().toString(),
      title: newTitle,
      status: 'in-progress' as const,
    };
    dispatch(addDocument(newDocument));
    setNewTitle('');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <h1 className="text-center my-4">Kanban Board</h1>
          <div className="mb-4">
            <input
              type="text"
              className="form-control w-25 mb-2"
              placeholder="Enter document title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button className="btn btn-primary mb-4" onClick={handleAddDocument}>
              Add Document
            </button>
          </div>

          <div className="row">
            {Object.entries(groupedDocuments).map(([status, docs]) => (
              <div key={status} className="col-md-4">
                <Column status={status as Document['status']} documents={docs} />
              </div>
            ))}
          </div>
      </div>
    </DndProvider>
  );
};

export default Home;
