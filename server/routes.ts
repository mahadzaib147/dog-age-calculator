import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { BREEDS, type Breed, type CalculationResult } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.breeds.list.path, (_req, res) => {
    res.json(BREEDS);
  });

  app.post(api.calculate.path, async (req, res) => {
    try {
      const input = api.calculate.input.parse(req.body);
      let { dogAge, breed, size: manualSize } = input;
      
      // Handle the Years.Months format (e.g., 3.10 -> 3 years and 10 months)
      const ageStr = dogAge.toString();
      if (ageStr.includes('.')) {
        const parts = ageStr.split('.');
        const years = parseInt(parts[0]) || 0;
        let monthsPart = parts[1];
        
        // Ensure we handle "3.10" correctly as 10 months
        // If ageStr is "3.10", monthsPart will be "10"
        const months = parseInt(monthsPart) || 0;
        
        if (months >= 0) {
          // Normalizing: 3.1 -> 3 years 1 month, 3.10 -> 3 years 10 months
          dogAge = years + (months / 12);
        }
      } else {
        dogAge = parseFloat(ageStr) || 0;
      }
      
      const result = calculateDogAge(Number(dogAge), (breed as Breed) || undefined, manualSize);
      
      await storage.logCalculation({
        breed: breed || null,
        size: manualSize || null,
        dogAge: String(dogAge),
        humanAge: result.humanAge
      });

      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}

function calculateDogAge(age: number, breed?: Breed, manualSize?: string): CalculationResult {
  // Formula based on user provided data:
  // First 2 years = 24 for all breeds
  // After 2 years:
  // Small: +4 per year
  // Medium: +5 per year
  // Large: +6 per year
  // Giant: +7 per year

  const small = [
    "Beagle", "Border Terrier", "Boston Terrier", "Cavachon", 
    "Cavalier King Charles Spaniel", "Cavoodle (Small)", "Chihuahua", "Chug", 
    "Cockapoo (Small)", "Coton de Tulear", "Dachshund", "French Bulldog", 
    "Havanese", "Jack Russell Terrier", "Maltese", "Miniature Schnauzer", 
    "Papillons", "Pomeranian", "Pug", "Puggle", "Shetland Sheepdog", 
    "Shiba Inu", "Shih Tzu", "Spoodle (Small)", "Yorkshire Terrier",
    "Bernedoodle (Small)", "Goldendoodle (Small)", "Labradoodle (Small)", "Schnoodle (Small)"
  ];
  const large = [
    "Akita", "Alaskan Malamutes", "Belgian Malinois", "Boxer", "Briard", 
    "Cane Corso", "Chesapeake Bay Retriever", "Chow Chow", "Doberman Pinscher", 
    "German Shepherd", "German Shorthaired Pointer", "Golden Retriever", 
    "Greyhound", "Labrador Retriever", "Poodle", "Rottweiler", "Siberian Husky",
    "Bernedoodle (Large)", "Cavoodle (Large)", "Cockapoo (Large)", 
    "Goldendoodle (Large)", "Labradoodle (Large)", "Schnoodle (Large)", "Spoodle (Large)"
  ];
  const giant = [
    "Bernese Mountain", "Boerboel", "Bullmastiffs", "Carpathian Shepherd", 
    "Great Dane", "Irish Wolfhound", "Mastiffs", "Newfoundlands", 
    "Saint Bernard"
  ];

  const medium = [
    "Aspin", "Australian Cattle Dog", "Australian Shepherd", "Basset Hound", 
    "Bernedoodle (Medium)", "Border Collie", "Brittany", "Bulldog", "Cocker Spaniel", 
    "English Springer Spaniel", "Eurasier", "Goldendoodle (Medium)", 
    "Labradoodle (Medium)", "Miniature American Shepherd", "Pembroke Welsh Corgi", 
    "Pitbull", "Portuguese Water Dogs", "Schnoodle (Medium)", "Staffordshire Bull Terrier", 
    "Vizslas", "Cavoodle (Medium)", "Cockapoo (Medium)", "Spoodle (Medium)"
  ]; 


  let size = "medium";
  if (breed) {
    if (small.includes(breed)) size = "small";
    else if (medium.includes(breed)) size = "medium";
    else if (large.includes(breed)) size = "large";
    else if (giant.includes(breed)) size = "giant";
  } else if (manualSize) {
    size = manualSize.toLowerCase();
  }

  let humanAge = 0;
  if (size === "giant") {
    // Giant specific rules: 1=12, 2=22, 3=31, 4=38, 5=45
    if (age <= 1) {
      humanAge = age * 12;
    } else if (age <= 2) {
      humanAge = 12 + (age - 1) * 10; // 12 + 10 = 22
    } else if (age <= 3) {
      humanAge = 22 + (age - 2) * 9; // 22 + 9 = 31
    } else if (age <= 4) {
      humanAge = 31 + (age - 3) * 7; // 31 + 7 = 38
    } else if (age <= 5) {
      humanAge = 38 + (age - 4) * 7; // 38 + 7 = 45
    } else {
      // Continue with +7 per year after 5
      humanAge = 45 + (age - 5) * 7;
    }
  } else if (age <= 2) {
    if (size === "small" || size === "medium") {
      // Small/Medium: 1yr = 15, 2yrs = 24
      if (age <= 1) {
        humanAge = age * 15;
      } else {
        humanAge = 15 + (age - 1) * 9;
      }
    } else {
      // Large: 1yr = 12, 2yrs = 24
      if (age <= 1) {
        humanAge = age * 12;
      } else {
        humanAge = 12 + (age - 1) * 12;
      }
    }
  } else {
    // After base years, aging rate depends on size
    const remainingYears = age - 2;
    
    if (size === "small") {
      humanAge = 24 + (remainingYears * 4);
    } else if (size === "medium") {
      humanAge = 24 + (remainingYears * 5);
    } else if (size === "large") {
      humanAge = 24 + (remainingYears * 6);
    } else if (size === "giant") {
      // Already handled in the giant specific block above
    } else {
      humanAge = 24 + (remainingYears * 5);
    }
  }
  humanAge = Math.round(humanAge);

  // Life Stage based on user-provided size-specific rules
  let lifeStage = { label: "Adult", badgeColor: "#3b82f6", message: "In their prime years!" };
  
  const ageInMonths = age * 12;

  if (size === "small") {
    if (ageInMonths <= 6) {
      lifeStage = { label: "Puppy", badgeColor: "#ec4899", message: "Full of boundless energy and curiosity!" };
    } else if (ageInMonths <= 12) {
      lifeStage = { label: "Adolescent", badgeColor: "#fb923c", message: "Testing boundaries and learning the world!" };
    } else if (age < 8) {
      lifeStage = { label: "Adult", badgeColor: "#3b82f6", message: "Mature, loyal, and established in their routine." };
    } else {
      lifeStage = { label: "Senior", badgeColor: "#a855f7", message: "Entering their golden years with wisdom and grace." };
    }
  } else if (size === "medium") {
    if (ageInMonths <= 6) {
      lifeStage = { label: "Puppy", badgeColor: "#ec4899", message: "Full of boundless energy and curiosity!" };
    } else if (ageInMonths <= 18) {
      lifeStage = { label: "Adolescent", badgeColor: "#fb923c", message: "Testing boundaries and learning the world!" };
    } else if (age < 7) {
      lifeStage = { label: "Adult", badgeColor: "#3b82f6", message: "Mature, loyal, and established in their routine." };
    } else {
      lifeStage = { label: "Senior", badgeColor: "#a855f7", message: "Entering their golden years with wisdom and grace." };
    }
  } else if (size === "large") {
    if (ageInMonths <= 9) {
      lifeStage = { label: "Puppy", badgeColor: "#ec4899", message: "Full of boundless energy and curiosity!" };
    } else if (ageInMonths <= 24) {
      lifeStage = { label: "Adolescent", badgeColor: "#fb923c", message: "Testing boundaries and learning the world!" };
    } else if (age < 6) {
      lifeStage = { label: "Adult", badgeColor: "#3b82f6", message: "Mature, loyal, and established in their routine." };
    } else {
      lifeStage = { label: "Senior", badgeColor: "#a855f7", message: "Entering their golden years with wisdom and grace." };
    }
  } else if (size === "giant") {
    if (ageInMonths <= 12) {
      lifeStage = { label: "Puppy", badgeColor: "#ec4899", message: "Full of boundless energy and curiosity!" };
    } else if (ageInMonths <= 30) {
      lifeStage = { label: "Adolescent", badgeColor: "#fb923c", message: "Testing boundaries and learning the world!" };
    } else if (age < 5) {
      lifeStage = { label: "Adult", badgeColor: "#3b82f6", message: "Mature, loyal, and established in their routine." };
    } else {
      lifeStage = { label: "Senior", badgeColor: "#a855f7", message: "Entering their golden years with wisdom and grace." };
    }
  }

  // Prime Stage based on size-specific rules
  let primeStage = { label: "Before Prime", description: "Growing and learning every day!" };
  
  let primeMax = 6;
  if (size === "small") primeMax = 8;
  else if (size === "medium") primeMax = 7;
  else if (size === "large") primeMax = 6;
  else if (size === "giant") primeMax = 5;

  if (age < 2) {
    primeStage = { label: "Before Prime", description: "Growing and learning every day!" };
  } else if (age <= primeMax) {
    primeStage = { label: "In Prime", description: "Peak health, strength, and vitality!" };
  } else {
    primeStage = { label: "After Prime", description: "Wise, experienced, and enjoying a slower pace." };
  }

  // Expected lifespan based on Pedigree/Size
  const expectedLifespan = size === "small" ? 16 : size === "giant" ? 9 : size === "large" ? 11 : 13;
  const progress = Math.min(Math.round((age / expectedLifespan) * 100), 100);

  let energyLevel: { level: "High" | "Moderate" | "Low"; description: string } = { level: "Moderate", description: "Balances playtime with relaxation." };
  let activityNeeds = { capacity: "Moderate Walk", description: "Enjoys a good walk but knows when to rest." };

  const isYoungAdult = (
    (size === "small" && age >= 1 && age <= 3) ||
    (size === "medium" && age >= 1.5 && age <= 3) ||
    (size === "large" && age >= 2 && age <= 3) ||
    (size === "giant" && age >= 2.5 && age <= 3)
  );

  if (lifeStage.label === "Puppy" || lifeStage.label === "Adolescent") {
    energyLevel = { level: "High", description: "Very High! Expect limitess energy and frequent zoomies." };
    activityNeeds = { capacity: "Active Play", description: "Thrives on frequent play and short, intense bursts of exercise." };
  } else if (lifeStage.label === "Senior") {
    energyLevel = { level: "Low", description: "Taking it easy. Prefers quiet spots and gentle affection." };
    activityNeeds = { capacity: "Gentle Strolls", description: "Short, easy walks to keep joints moving without strain." };
  } else if (isYoungAdult) {
    if (size === "small" || size === "medium") {
      energyLevel = { level: "High", description: "High vitality! Plenty of energy for play and exploration." };
      activityNeeds = { capacity: "Vigorous Exercise", description: "Needs daily active exercise and mental stimulation." };
    } else {
      energyLevel = { level: "Moderate", description: "Steady energy. Ready for activity but settles well." };
      activityNeeds = { capacity: "Structured Play", description: "Requires consistent daily exercise to stay fit." };
    }
  } else {
    // Mature Adult
    if (size === "giant") {
      energyLevel = { level: "Low", description: "Low to Moderate. Prefers a slower pace and plenty of rest." };
      activityNeeds = { capacity: "Steady Walks", description: "Regular, moderate exercise is key at this stage." };
    } else {
      energyLevel = { level: "Moderate", description: "Moderate energy. Content with a balanced routine." };
      activityNeeds = { capacity: "Daily Walks", description: "Regular daily walks and some play are perfect." };
    }
  }

  return {
    humanAge,
    lifeStage,
    primeStage,
    energyLevel,
    activityNeeds,
    ageProgress: progress
  };
}
