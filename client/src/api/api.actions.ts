import axios, { AxiosResponse } from "axios"
import { UserModel } from "../models/user.model"
import { VacationModel } from "../models/vacations.model"
import { getDecodedJwt, getSavedJwt } from "../utils/helpers"

const BASE_URL = 'http://localhost:4000';

export const API_ACTIONS = {
    getVacations: async (): Promise<AxiosResponse<{sortedVacations: VacationModel[], followsVacations: number[]}>> =>{
        const token: string = getSavedJwt()
        const user: Partial<UserModel> = getDecodedJwt(token)
        
        return await axios.get<{sortedVacations: VacationModel[], followsVacations: number[]}>(`${BASE_URL}/api/vacations/user/${user.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    },
    addVacation: async (newVacation: Partial<VacationModel>) =>{
        const token: string = getSavedJwt()
        const { description, destination, imgUrl, fromDate, toDate, price } = newVacation;
        
        return await axios.post<{ _id: number }>(`${BASE_URL}/api/vacations`, { description, destination, imgUrl, fromDate, toDate, price }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    },
    updateVacation: async (updatedVacation: VacationModel): Promise<void> => {
        const token: string = getSavedJwt()
        const { id, description, destination, imgUrl, fromDate, toDate, price } = updatedVacation;
        
        return await axios.put(`${BASE_URL}/api/vacations`, { description, destination, imgUrl, fromDate, toDate, price }, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { id, description, destination, imgUrl, fromDate, toDate, price }
        })
    },
    removeVacation: async (vacationId: number) => {
        const token: string = getSavedJwt()
        
        return await axios.delete(`${BASE_URL}/api/vacations/${vacationId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
    },
    vacationFollowing: async (vacationId: number, action: string) => {
        const token: string = getSavedJwt()
        const user: Partial<UserModel> = getDecodedJwt(token)
        
        return await axios.get<{sortedVacations: VacationModel[], followsVacations: number[]}>(`${BASE_URL}/api/vacations/${action}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                userId: user.id,
                vacationId: vacationId
            }
        })
    },
}