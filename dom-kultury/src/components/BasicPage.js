import React from "react";
import { Route, Switch } from "react-router-dom";
import Events from "./Events";
import Employees from "./Employees";
import Participants from './Participants'
import Home from "./Home";

function BasicPage() {

  return (
    <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/calendar">
          <div>calendar</div>
        </Route>
        <Route path="/events">
          <Events />
        </Route>
        <Route path="/participants">
           <Participants />
        </Route>
        <Route path="/employees">
          <Employees />
        </Route>
        <Route path="/myprofile">
          <div>my profile</div>
        </Route>
      </Switch>
  );
}
export default BasicPage;
