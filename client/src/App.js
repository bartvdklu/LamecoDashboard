import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRouter";

import Login from "./components/login/Login";
import Dashboard from "./components/pages/Dashboard";
import DashboardEdit from "./components/dashboardEdit/DashboardEdit";
import AdminProfile from "./components/profile/AdminProfile";
import AddUser from "./components/profile/AddUser";
import Page from "./components/pages/Page";

import "./App.css";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/forgot-password" component={Login} />
              <Route exact path="/sent-password-reset" component={Login} />
              <Route exact path="/password-reset/:key" component={Login} />
              <Route exact path="/password-reset-success" component={Login} />
              <Route exact path="/add-user" component={AddUser} />
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute
                exact
                path="/dashboard-edit/:handle"
                component={DashboardEdit}
              />
              <PrivateRoute exact path="/profile" component={AdminProfile} />
              <Route exact path="/:company/:dashboard" component={Page} />
              <Route component={Login} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
