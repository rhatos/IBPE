import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the interface for a training queue item
export interface TrainingQueueItem {
  name: string; // The name of the model
  _id: string;  // The unique identifier for the model
}

// Define the interface for the training state
interface TrainingState {
  trainingQueue: TrainingQueueItem[]; // Array to hold the training queue items
}

// Set the initial state for the training queue slice
const initialState: TrainingState = {
  trainingQueue: [], // Start with an empty training queue
};

// Create the slice for managing the training queue
const trainingQueueSlice = createSlice({
  name: 'trainingQueue', // The name of the slice
  initialState, // The initial state for this slice
  reducers: {
    // Reducer to add an item to the training queue
    addToTrainingQueue(state, action: PayloadAction<TrainingQueueItem>) {
      state.trainingQueue.push(action.payload); // Add the new item to the queue
    },
    // Reducer to remove an item from the training queue
    removeFromTrainingQueue(state, action: PayloadAction<TrainingQueueItem>) {
      state.trainingQueue = state.trainingQueue.filter(
        item => item.name !== action.payload.name // Remove the item with the matching name
      );
    },
  },
});

// Export the action creators so they can be dispatched in components
export const { addToTrainingQueue, removeFromTrainingQueue } = trainingQueueSlice.actions;

// Export the reducer to be included in the Redux store
export default trainingQueueSlice.reducer;
