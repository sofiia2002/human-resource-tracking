import React from "react";
import { Route, Switch } from "react-router-dom";
import Events from "./Events";
import Employees from "./Employees";
import Exhibitions from "./Exhibitions";
import Lessons from "./Lessons";
import Participants from "./Participants";
import Home from "./Home";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";

function BasicPage() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/events">
        <Events />
      </Route>
      <Route path="/exhibitions">
        <Exhibitions />
      </Route>
      <Route path="/lessons">
        <Lessons />
      </Route>
      <Route path="/participants">
        <Participants />
      </Route>
      <Route path="/employees">
        <Employees />
      </Route>
      <Route path="/myprofile">
        <MyProfile />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
    </Switch>
  );
}
export default BasicPage;
