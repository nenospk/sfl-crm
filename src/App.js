import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";

import InsertPage from "./pages/InsertPage";
import ViewPage from "./pages/ViewPage";
import Dashboard from "./pages/Dashboard";
import Signout from "./pages/Signout";

import { DataProvider } from "./pages/Firestore";

import "./style.css";

export default function App() {
  const [navigator, setNavigator] = useState();
  return (
    <Router>
      <DataProvider>
        <Switch>
          <Route
            path="/"
            exact
            render={props => <InsertPage {...props} isAuthed={true} />}
          />
          <Route
            path="/view"
            render={props => <ViewPage {...props} isAuthed={true} />}
          />
          <Route
            path="/dashboard"
            render={props => <Dashboard {...props} isAuthed={true} />}
          />
          <Route
            path="/signout"
            render={props => <Signout {...props} isAuthed={true} />}
          />
        </Switch>
      </DataProvider>
    </Router>
  );
}
