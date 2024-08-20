import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TrainingQueueItem  {
    name: string;
}

interface TrainingState {
    trainingQueue: TrainingQueueItem[];
}

const initialState: TrainingState = {
    trainingQueue: [],
};

const trainingQueueSlice = createSlice({
  name: 'trainingQueue',
  initialState,
  reducers: {
    addToTrainingQueue(state, action: PayloadAction<TrainingQueueItem>) {
        state.trainingQueue.push(action.payload);
    },
    removeFromTrainingQueue(state, action: PayloadAction<TrainingQueueItem>) {
        state.trainingQueue = state.trainingQueue.filter(item => item.name !== action.payload.name);
    },
  },
});

export const { addToTrainingQueue, removeFromTrainingQueue } = trainingQueueSlice.actions;
export default trainingQueueSlice.reducer;
