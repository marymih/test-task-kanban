import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion';
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
  const dragRef = useRef<HTMLLIElement>(null);
  const [, connectRef] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: document.id, status: document.status },
  }));

  connectRef(dragRef);

  const dispatch = useDispatch();

  const handleDeleteDocument = (id: string) => {
    dispatch(deleteDocument(id));
  };

  return (
    <motion.li ref={dragRef}
      className="list-group-item d-flex justify-content-between align-items-center mb-2"
      style={{ cursor: 'pointer', borderTop: '1px solid #dee2e6', borderRadius: '5px' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      layout
    >
      {document.title}
      <button className='btn btn-sm btn-danger' onClick={() => handleDeleteDocument(document.id)}>Delete</button>
    </motion.li>
  );
}

const Column: React.FC<{
  status: Document['status'];
  documents: Document[];
}> = ({ status, documents }) => {
  const dispatch = useDispatch();

  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isOver}, connectRef] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { id: string; status: string }) => {
      if (item.status !== status) {
        dispatch(updateDocumentStatus({ id: item.id, newStatus: status }));
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  connectRef(dropRef);

  return (
    <motion.div
      ref={dropRef}
      className={`p-3 mb-3 ${isOver ? 'bg-light' : ''}`}
      style={{ minHeight: '200px' }}
    >
      <div
        className="card-header bg-secondary text-white mb-3 d-flex justify-content-center align-items-center"
        style={{ height: '50px' }}
      >
        <h5 className="card-title">
          {status.replace('-', ' ').toUpperCase()}
        </h5>
      </div>
      <div className="card-body">
        <motion.ul className='list-group' layout>
          <AnimatePresence initial={false}>
            {documents.map((doc) => (
              <Card key={doc.id} document={doc} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </motion.div>
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
