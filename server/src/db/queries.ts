import { ResultSetHeader, RowDataPacket } from "mysql2";
import { UserModel } from "../models/user.model";
import { VacationModel } from "../models/vacations.model";
import { db } from "./db";

type DbQueryResult<TableRecord> = (TableRecord & RowDataPacket)[];

export async function fetchUser(userName: string): Promise<UserModel> {
  const [[user]] = await db.query<DbQueryResult<UserModel>>("SELECT _id id, first_name firstName, last_name lastName, user_name userName, password, is_admin isAdmin FROM users WHERE user_name = ?", [userName]);
  return user as UserModel;
}
export async function addUser(firstName: string, lastName: string, userName: string, password: string): Promise<ResultSetHeader> {
  const [result] = await db.query<ResultSetHeader>("INSERT INTO users (first_name, last_name, user_name, password) VALUES (?, ?, ?, ?)", [firstName, lastName , userName, password]);
  return result;
}
export async function fetchVacations(): Promise<VacationModel[]> {
  const [vacations] = await db.query<DbQueryResult<VacationModel>>("SELECT _id id, description, destination, img_url imgUrl, from_date fromDate, to_date toDate, price, followers_quantity followersQuantity FROM vacations");
  return vacations as VacationModel[];
}
export async function fetchfollowedVacations(id: number): Promise<number[]> {
  const [vacationsIds] = await db.query<DbQueryResult<number>>("SELECT vacation_id id FROM user_vacations WHERE user_id = ?", [id]);
  return vacationsIds as number[];
}
export async function addVacation(description: string, destination: string, imgUrl: string, fromDate: string, toDate: string, price: number): Promise<ResultSetHeader> {
  const [results] = await db.query<ResultSetHeader>("INSERT INTO vacations (description, destination, img_url, from_date, to_date, price) VALUES (?, ?, ?, ?, ?, ?)", [description, destination, imgUrl, fromDate, toDate, price]);
  return results;
}
export async function updateVacation(id: number, description: string, destination: string, imgUrl: string, fromDate: string, toDate: string, price: number): Promise<ResultSetHeader> {
  const [results] = await db.query<ResultSetHeader>(`
      UPDATE vacations SET 
      description = ?, 
      destination = ?,
      img_url = ?,
      from_date = ?,
      to_date = ?,
      price = ?
      WHERE _id = ?;
  `, [description, destination, imgUrl, fromDate, toDate, price, id]);
  return results;
}
export async function deleteVacation(id: number): Promise<ResultSetHeader> {
  const [results] = await db.query<ResultSetHeader>("DELETE FROM vacations WHERE _id = ?", [id]);
  return results;
}
export async function followVacation(userId: number, vacationId: number): Promise<ResultSetHeader> {
  const [results] = await db.query<ResultSetHeader>(`
  INSERT INTO user_vacations (user_id, vacation_id) VALUES (?, ?);
  UPDATE vacations SET followers_quantity = followers_quantity + 1 WHERE _id = ?;
`, [userId, vacationId, vacationId]);
  return results;
}
export async function unfollowVacation(userId: number, vacationId: number): Promise<ResultSetHeader> {
  const [results] = await db.query<ResultSetHeader>(`
      DELETE FROM user_vacations WHERE user_id = ? AND vacation_id = ?;
      UPDATE vacations SET followers_quantity = followers_quantity - 1 WHERE _id = ? AND followers_quantity > 0;
`, [userId, vacationId, vacationId]); 
  return results;
}