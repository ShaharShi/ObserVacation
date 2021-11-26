import React from 'react';
import { socketMiddleware } from '../../api/io.actions';
import { CONTEXT_ACTIONS } from '../../context/actions';
import { StateContext } from '../../context/app.state';

// I hope that is a good idea (or at least not a bad one) to make a provider with the socket listeners..
// I preffered to avoid from set socket functionality in App component.
// i decided to put the socket listeners in a react component, because that i need the global context to transport into CONTEXT_ATIONS when a new action occurred.
export class SocketProvider extends React.Component {
    static contextType = StateContext;
  
    componentDidMount = () => {
      const socket = socketMiddleware({
        type: 'GET_CONNECTION'
      })
      socket?.on('unfollow_vacation', (id) => {
          CONTEXT_ACTIONS.unFollowVacation(this.context, id, false);
      })
      socket?.on('follow_vacation', (id) => {
          CONTEXT_ACTIONS.followVacation(this.context, id, false);
      })
      socket?.on('update_vacation', (updatedVacation) => {
          CONTEXT_ACTIONS.updateVacation(this.context, updatedVacation);
      })
      socket?.on('add_vacation', (newVacation) => {
          CONTEXT_ACTIONS.addVacation(this.context, newVacation);
      })
      socket?.on('remove_vacation', (id) => {
          CONTEXT_ACTIONS.removeVacation(this.context, id);
      })
    }
  
    render() {
      const { children } = this.props;
      return children;
    }
  }