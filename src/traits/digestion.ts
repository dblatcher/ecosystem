import { Animal, AnimalData } from "../abstract-entities/Animal";

export type AnimalWithFat = Animal & {
  fatStorageFactor?: number;
  fatBurnFactor?: number;
  fatBurnRate?: number;
  fatStoreRate?: number;
  data: AnimalData & { fat: number };
};

export type FatManagementPlan = {
  maxFat: number;
  minimalEnergyLevel: number;
  excessEnergyLevel: number;
};

const DEFAULT = {
  fatStorageFactor: 0.8,
  fatBurnFactor: 0.9,
  fatBurnRate: 5,
  fatStoreRate: 5,
};

const storeFat = (that: AnimalWithFat) => (energyInput: number) => {
  const {
    fatStoreRate = DEFAULT.fatStoreRate,
    fatStorageFactor = DEFAULT.fatStorageFactor,
  } = that;
  energyInput = Math.min(energyInput, fatStoreRate);
  that.data.energy -= energyInput;
  that.data.fat += energyInput * fatStorageFactor;
};

const burnFat = (that: AnimalWithFat) => (fatInput: number) => {
  const {
    fatBurnFactor = DEFAULT.fatBurnFactor,
    fatBurnRate = DEFAULT.fatBurnRate,
  } = that;
  that.data.fat -= Math.min(fatInput, fatBurnRate);
  that.data.energy += fatInput * fatBurnFactor;
};

export const manageFatLevel =
  (that: AnimalWithFat) => (plan: FatManagementPlan) => {
    const {
      fatStoreRate = DEFAULT.fatStoreRate,
      fatStorageFactor = DEFAULT.fatStorageFactor,
      fatBurnFactor = DEFAULT.fatBurnFactor,
      fatBurnRate = DEFAULT.fatBurnRate,
    } = that;
    const { maxFat, minimalEnergyLevel, excessEnergyLevel } = plan;
    const { energy, fat } = that.data;

    if (energy > excessEnergyLevel && fat < maxFat) {
      let amountOfEnergyToStore = 0;
      const excess = energy - excessEnergyLevel;
      const mostFatCouldAdd = Math.min(excess, fatStoreRate) * fatStorageFactor;
      if (fat + mostFatCouldAdd <= maxFat) {
        amountOfEnergyToStore = Math.min(excess, fatStoreRate);
      } else {
        amountOfEnergyToStore = (maxFat - fat) / fatStorageFactor;
      }
      that.report(
        `${that.description} has excess energy and is converting ${amountOfEnergyToStore} to fat.`
      );
      return storeFat(that)(amountOfEnergyToStore);
    }

    if (energy < minimalEnergyLevel && fat > 0) {
      let amountOfFatToBurn = 0;
      const deficit = minimalEnergyLevel - energy;
      const mostEnergyCouldGain = Math.min(fat, fatBurnRate) * fatBurnFactor;

      if (mostEnergyCouldGain > deficit) {
        amountOfFatToBurn = deficit / fatStorageFactor;
      } else {
        amountOfFatToBurn = Math.min(fat, fatBurnRate);
      }
      that.report(
        `${that.description} is low on energy and is burning ${amountOfFatToBurn} fat.`
      );
      return burnFat(that)(amountOfFatToBurn);
    }
  };
