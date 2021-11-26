import React from 'react';
import { VacationModel } from '../models/vacations.model';

export interface AppState {
    vacations: {
        sortedVacations: VacationModel[],
        follows: number[]
    }
}

export interface IContext {
    appState: AppState;
    setAppState: (state: Partial<AppState>) => void
}

export const StateContext = React.createContext<IContext>({ appState: {} as any, setAppState: (state: Partial<AppState>) => null });