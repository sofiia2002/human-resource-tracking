import React, { useState, useEffect } from "react";
import axios from "axios";
import { Route, Switch } from "react-router-dom";
import Events from "./Events";
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
           <div>participants</div>
        </Route>
        <Route path="/employees">
          <div>employees</div>
        </Route>
        <Route path="/myprofile">
          <div>my profile</div>
        </Route>
      </Switch>
  );
}
export default BasicPage;
