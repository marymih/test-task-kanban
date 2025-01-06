import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Document {
  id: string;
  title: string;
  status: 'in-progress' | 'under-review' | 'completed';
}

const initialState: Document[] = [
  { id: '1', title: 'Document 1', status: 'in-progress' },
  { id: '2', title: 'Document 2', status: 'in-progress' },
  { id: '3', title: 'Document 3', status: 'under-review' },
  { id: '4', title: 'Document 4', status: 'completed' },
];

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    updateDocumentStatus: (
      state,
      action: PayloadAction<{ id: string; newStatus: Document['status'] }>
    ) => {
      const { id, newStatus } = action.payload;
      const document = state.find((doc) => doc.id === id);
      if (document) {
        document.status = newStatus;
      }
    },
    addDocument: (state, action: PayloadAction<Document>) => {
      state.push(action.payload);
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      return state.filter((doc) => doc.id !== id);
    },
  },
});

export const { updateDocumentStatus, addDocument, deleteDocument } =
  boardSlice.actions;
export default boardSlice.reducer;
