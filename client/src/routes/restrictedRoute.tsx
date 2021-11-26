import React from 'react';
import { Redirect, Route } from "react-router-dom";
import { UserModel } from '../models/user.model';
import { getDecodedJwt, getSavedJwt } from '../utils/helpers';

export class RestrictedRoute extends React.Component<{ path: string }> {
    render () {
        const { children, path } = this.props;
        const token = getSavedJwt();
        const user: Partial<UserModel> = getDecodedJwt(token)
        return (
          <Route
            path={path}
            exact
            render={() =>
              user.isAdmin ? (
                children
              ) : (
                <Redirect to={'/'} />
              )
            }
          />
        );
    }
  }