import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppState, StateContext } from "./context/app.state";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { AppRouter } from "./routes/appRouter";
import { SocketProvider } from "./components/socket-provider";

export default class App extends React.Component<{}, AppState> {
  state: AppState = {
    vacations: {
      sortedVacations: [],
      follows: []
    }
  };

  setAppState = (newAppState: Partial<AppState>) => {
    this.setState(newAppState as any);
  };

  render() {
    return (
      <BrowserRouter>
        <StateContext.Provider value={{ appState: this.state, setAppState: this.setAppState }}>
          <SocketProvider>
            <AppRouter />
          </SocketProvider>
        </StateContext.Provider>
      </BrowserRouter>
    );
  }
}