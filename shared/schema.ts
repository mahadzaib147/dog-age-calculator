import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  breed: text("breed"),
  size: text("size"), // "Small", "Medium", "Large", "Giant"
  dogAge: text("dog_age").notNull(),
  humanAge: integer("human_age").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({ 
  id: true, 
  createdAt: true 
});

export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;

export const BREEDS = [
  "Akita",
  "Alaskan Malamutes",
  "Aspin",
  "Australian Cattle Dog",
  "Australian Shepherd",
  "Basset Hound",
  "Beagle",
  "Belgian Malinois",
  "Bernedoodle (Large)",
  "Bernedoodle (Medium)",
  "Bernedoodle (Small)",
  "Bernese Mountain",
  "Boerboel",
  "Border Collie",
  "Border Terrier",
  "Boston Terrier",
  "Boxer",
  "Briard",
  "Brittany",
  "Bulldog",
  "Bullmastiffs",
  "Cane Corso",
  "Carpathian Shepherd",
  "Cavachon",
  "Cavalier King Charles Spaniel",
  "Cavoodle (Large)",
  "Cavoodle (Medium)",
  "Cavoodle (Small)",
  "Chesapeake Bay Retriever",
  "Chihuahua",
  "Chow Chow",
  "Chug",
  "Cockapoo (Large)",
  "Cockapoo (Medium)",
  "Cockapoo (Small)",
  "Cocker Spaniel",
  "Coton de Tulear",
  "Dachshund",
  "Doberman Pinscher",
  "English Springer Spaniel",
  "Eurasier",
  "French Bulldog",
  "German Shepherd",
  "German Shorthaired Pointer",
  "Golden Retriever",
  "Goldendoodle (Large)",
  "Goldendoodle (Medium)",
  "Goldendoodle (Small)",
  "Great Dane",
  "Greyhound",
  "Havanese",
  "Siberian Husky",
  "Irish Wolfhound",
  "Jack Russell Terrier",
  "Labradoodle (Large)",
  "Labradoodle (Medium)",
  "Labradoodle (Small)",
  "Labrador Retriever",
  "Maltese",
  "Mastiffs",
  "Miniature American Shepherd",
  "Miniature Schnauzer",
  "Newfoundlands",
  "Papillons",
  "Pembroke Welsh Corgi",
  "Pitbull",
  "Pomeranian",
  "Poodle",
  "Portuguese Water Dogs",
  "Pug",
  "Puggle",
  "Rottweiler",
  "Saint Bernard",
  "Schnoodle (Large)",
  "Schnoodle (Medium)",
  "Schnoodle (Small)",
  "Shetland Sheepdog",
  "Shiba Inu",
  "Shih Tzu",
  "Spoodle (Large)",
  "Spoodle (Medium)",
  "Spoodle (Small)",
  "Staffordshire Bull Terrier",
  "Vizslas",
  "Yorkshire Terrier"
] as const;

export type Breed = typeof BREEDS[number];

export const CalculateRequestSchema = z.object({
  dogAge: z.union([z.number(), z.string()]),
  breed: z.string().optional(),
  size: z.enum(["Small", "Medium", "Large", "Giant"]).optional()
}).refine(data => data.breed || data.size, {
  message: "Either breed or size must be provided"
});

export type CalculateRequest = z.infer<typeof CalculateRequestSchema>;

export interface CalculationResult {
  humanAge: number;
  lifeStage: {
    label: string;
    badgeColor: string;
    message: string;
  };
  primeStage: {
    label: string; // "Before Prime", "In Prime", "After Prime"
    description: string;
  };
  energyLevel: {
    level: "High" | "Moderate" | "Low";
    description: string;
  };
  activityNeeds: {
    capacity: string;
    description: string;
  };
  ageProgress: number;
}
