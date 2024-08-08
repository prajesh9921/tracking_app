import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomeScreen from "./Screens/Home/home";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import challengeReducer from "./Store/store";

// Configure the store with your reducer
const store = configureStore({
  reducer: {
    challenges: challengeReducer,
  },
});

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </Provider>
  );
}

export default App;
