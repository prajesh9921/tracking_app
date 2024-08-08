import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  challenges: JSON.parse(localStorage.getItem("chllangedata"))?.data || [],
  editData: null,
};

export const challengeSlice = createSlice({
  name: "challenges",
  initialState,
  reducers: {
    addChallenge: (state, action) => {
      state.challenges = [...state.challenges, ...action.payload];
      localStorage.setItem(
        "chllangedata",
        JSON.stringify({ data: state.challenges })
      );
    },
    setData: (state, action) => {
      state.challenges = action.payload;
    },
    setEditData: (state, action) => {
      state.editData = action.payload.itemdata;
    },
    clearEditData: (state) => {
      state.editData = null;
    },
    statusChallenge: (state, action) => {
      state.challenges = action.payload;
      localStorage.setItem(
        "chllangedata",
        JSON.stringify({ data: state.challenges })
      );
    },
    updateChallenge: (state, action) => {
      state.challenges = action.payload;
      localStorage.setItem(
        "chllangedata",
        JSON.stringify({ data: state.challenges })
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addChallenge,
  setData,
  setEditData,
  clearEditData,
  statusChallenge,
  updateChallenge,
} = challengeSlice.actions;

export default challengeSlice.reducer;
