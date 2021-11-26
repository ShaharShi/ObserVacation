import { Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import { addVacation, deleteVacation, fetchfollowedVacations, fetchVacations, followVacation, unfollowVacation, updateVacation } from '../db/queries';
import { VacationModel } from '../models/vacations.model';
import { ErrorModel } from '../models/error.model';
import { checkAdminPermissions } from '../middlewares/admin.middleware';
dotenv.config();

export const vacationsRouter = Router()

vacationsRouter.post("/", checkAdminPermissions ,async (req: Request, res: Response<{_id: number} | ErrorModel>) => {
    const { description, destination, imgUrl, fromDate, toDate, price }: { description: string, destination: string, imgUrl: string, fromDate: string, toDate: string, price: number } = req.body;

    const result = await addVacation(description, destination, imgUrl, fromDate, toDate, price)
    if(!result.affectedRows) res.status(500).send({ error: 'Some error occurred, please refresh the page and try again !' });

    res.status(201).send({ _id: result.insertId });
})
vacationsRouter.put("/", checkAdminPermissions, async (req: Request, res: Response<ErrorModel>) => {
    const { id, description, destination, imgUrl, fromDate, toDate, price }: Partial<VacationModel> = req.query;
    if (!description || !destination || !imgUrl || !fromDate || !toDate || !price) return res.status(400).send({ error: 'all vacation fields are required !' }) 

    const idAsNumber = Number(id)
    if(!idAsNumber) return res.status(400).send({ error: 'id parameter is require and must be an integer !' })

    const result = await updateVacation(idAsNumber, description, destination, imgUrl, fromDate, toDate, price as number)
    if(!result.affectedRows) res.status(500).send({ error: 'Some error occurred, please refresh the page and try again !' });

    res.status(201).send();
})
vacationsRouter.delete("/:id", checkAdminPermissions, async (req: Request, res: Response<{_id: number} | ErrorModel>) => {
    const { id } = req.params;
    const idAsNumber = Number(id)
    if(!idAsNumber) return res.status(400).send({
        error: 'id parameter is require and must be an integer !' 
    })

    const result = await deleteVacation(idAsNumber)
    if(!result.affectedRows) return res.status(500).send({ error: 'There is\'nt vacation with the given id !' });

    res.sendStatus(200);
})
vacationsRouter.get("/user/:id", async (req: Request, res: Response<{sortedVacations: VacationModel[], followsVacations: number[]} | ErrorModel>) => {
    const { id } = req.params;
    const idAsNumber = Number(id)
    if(!idAsNumber) return res.status(400).send({
        error: 'id parameter is require and must be an integer !'
    })
    
    //todo IMPORTANT FIX !, sort vacations in DB query in one action ...
    const vacations = await fetchVacations();
    const follows = await fetchfollowedVacations(idAsNumber);
    const followsVacations = follows.reduce((acc, obj: any) => acc.concat(obj.id), []) as number[];
    const sortedVacations: VacationModel[] = vacations.reduce((acc: VacationModel[], obj: VacationModel) =>  followsVacations.includes(obj.id) ? [obj, ...acc] : [...acc, obj], []);
    
    res.status(200).send({sortedVacations, followsVacations});
})
vacationsRouter.get("/follow", async (req: Request<{userId: string, vacationId: string}>, res: Response<ErrorModel>) => {
    const { userId, vacationId } = req.query;
    if (!userId || !vacationId) return res.status(400).send({ error: 'all parameters are require' })
    const userIdAsNumber = Number(userId);
    const vacationIdAsNumber = Number(vacationId);
    if (!userIdAsNumber || !vacationIdAsNumber) return res.status(400).send({ error: 'parameters are not valid ...' })

    await followVacation(userIdAsNumber, vacationIdAsNumber)
    res.status(200).send();
})
vacationsRouter.get("/unfollow", async (req: Request<{userId: string, vacationId: string}>, res: Response<ErrorModel>) => {
    const { userId, vacationId } = req.query;
    if (!userId || !vacationId) return res.status(400).send({ error: 'all parameters are require' })
    const userIdAsNumber = Number(userId);
    const vacationIdAsNumber = Number(vacationId);
    if (!userIdAsNumber || !vacationIdAsNumber) return res.status(400).send({ error: 'parameters are not valid ...' })

    await unfollowVacation(userIdAsNumber, vacationIdAsNumber)
    res.status(200).send();
})