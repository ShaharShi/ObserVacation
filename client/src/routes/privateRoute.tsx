import React from 'react';
import { Redirect, Route } from "react-router-dom";
import { getSavedJwt } from '../utils/helpers';

export class PrivateRoute extends React.Component<{ path: string }> {
    render () {
        const { children, path } = this.props;
        return (
          <Route
            path={path}
            exact
            render={() =>
              getSavedJwt() ? (
                children
              ) : (
                <Redirect to={'/login'} />
              )
            }
          />
        );
    }
  }