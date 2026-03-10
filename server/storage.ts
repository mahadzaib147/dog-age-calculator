import { db } from "./db";
import {
  calculations,
  type InsertCalculation,
  type Calculation,
} from "@shared/schema";

export interface IStorage {
  logCalculation(calculation: InsertCalculation): Promise<Calculation>;
}

export class DatabaseStorage implements IStorage {
  async logCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const [result] = await db
      .insert(calculations)
      .values(insertCalculation)
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
