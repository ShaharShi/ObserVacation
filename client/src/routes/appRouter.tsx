import React from "react";
import { Redirect, Route, Switch } from "react-router";
import AdminPage from "./admin-page";
import HomePage from "./home-page";
import LoginPage from "./login-page";
import { PrivateRoute } from "./privateRoute";
import ReportsPage from "./reports-page";
import { RestrictedRoute } from "./restrictedRoute";
import SignupPage from "./signup-page";

export class AppRouter extends React.Component {

  render () {

    return (
      <Switch>
          <Route exact path={'/login'} component={LoginPage} />
          <Route exact path={'/signup'} component={SignupPage} />
          <RestrictedRoute path={'/admin'}> <AdminPage /> </RestrictedRoute>
          <RestrictedRoute path={'/admin-reports'}> <ReportsPage /> </RestrictedRoute>
          <PrivateRoute path={'/'}> <HomePage /> </PrivateRoute>
          <Route path="*">
            <Redirect to="/" />
          </Route>
      </Switch>
    )
  }
}