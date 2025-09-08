// karnue-Admin/client/Store/Slice/feedBackSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface FeedbackUIState {
  selectedFeedbackId: string | null;
  filter: string; // e.g., search by name/email
}

const initialState: FeedbackUIState = {
  selectedFeedbackId: null,
  filter: "",
};

const feedBackSlice = createSlice({
  name: "feedbackUI",
  initialState,
  reducers: {
    setSelectedFeedback: (state, action) => {
      state.selectedFeedbackId = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearSelection: (state) => {
      state.selectedFeedbackId = null;
    },
  },
});

export const { setSelectedFeedback, setFilter, clearSelection } =
  feedBackSlice.actions;
export default feedBackSlice.reducer;
