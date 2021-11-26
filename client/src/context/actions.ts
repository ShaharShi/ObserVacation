import { API_ACTIONS } from "../api/api.actions";
import { VacationModel } from "../models/vacations.model";
import { IContext } from "./app.state";

export const CONTEXT_ACTIONS = {
    setVacations: (context: IContext, { sortedVacations, followsVacations}: {sortedVacations: VacationModel[], followsVacations: number[]}) => {
        const { setAppState } = context;
        setAppState({
            vacations: {
                sortedVacations: sortedVacations,
                follows: followsVacations
            }
        })
    },
    initialVacations: async (context: IContext, navigateToLogin: Function) => {
        try {
            const { data } = await API_ACTIONS.getVacations();
            CONTEXT_ACTIONS.setVacations(context, data);
            
            return data;
        } catch (err: any) {
            if (err.response.status === 401) navigateToLogin();
        }
    },
    addVacation: (context: IContext, newVacation: VacationModel) => {
        const { appState, setAppState } = context;
        setAppState({
            vacations: { ...appState.vacations,
                sortedVacations: [ ...appState.vacations.sortedVacations, newVacation]
            }
        })
    },
    updateVacation: (context: IContext, updatedVacation: VacationModel) => {
        const { appState, setAppState } = context;
        const { id } = updatedVacation;
        const updatedVacations: VacationModel[] = appState.vacations.sortedVacations.reduce((acc: VacationModel[], vacation: VacationModel): VacationModel[] => {
            if (vacation.id === id) return [ ...acc, updatedVacation]
            else return [...acc, vacation];
        }, [])
        
        setAppState({
            vacations: { ...appState.vacations,
                sortedVacations: updatedVacations
            }
        })
    },
    removeVacation: (context: IContext, id: number) => {
        const { appState, setAppState } = context;

        setAppState({
            vacations: {
                sortedVacations: appState.vacations.sortedVacations.filter((v: VacationModel) => v.id !== id),
                follows: appState.vacations.follows.filter((f_id: number) => f_id !== id)
            }
        })
    },
    followVacation: (context: IContext, vacationId: number, alsoFollowsArr: boolean) => {
        const { appState, setAppState } = context;
        setAppState({
            vacations: {
                sortedVacations: [...appState.vacations.sortedVacations.map((v: VacationModel) => { 
                    if (v.id === vacationId) v.followersQuantity += 1;
                    return v;
                })],
                follows: alsoFollowsArr ? appState.vacations.follows.concat(vacationId): appState.vacations.follows
            }
        })
    },
    unFollowVacation: (context: IContext, vacationId: number, alsoFollowsArr: boolean) => {
        const { appState, setAppState } = context;
        setAppState({
            vacations: {
                sortedVacations: [...appState.vacations.sortedVacations.map((v: VacationModel) => { 
                    if (v.id === vacationId) v.followersQuantity -= 1;
                    return v;
                })],
                follows: alsoFollowsArr ? [ ...appState.vacations.follows.filter((f: number) => f !== vacationId)] : appState.vacations.follows
            }
        })
    }
}