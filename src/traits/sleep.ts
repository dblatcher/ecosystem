import { Animal, AnimalData } from "../abstract-entities/Animal";

export type AnimalThatSleeps = Animal & {
    sleepStartTime?: number;
    wakeTime?: number;
    hoursOfSleepNeeded?: number;

    data: AnimalData & {
        isAsleep?: boolean;
        sleepDebt: number
    };
};

const DEFAULT = {
    sleepStartTime: 22,
    wakeTime: 6,
    hoursOfSleepNeeded: 6,
}

export type SleepManagementPlan = {

}

const ticksPerHour = 15 * 60 * 60



const sleepDebtGainPerTickAwake = (hoursOfSleepNeeded: number): number => {
    return (ticksPerHour * 24) / (24 - hoursOfSleepNeeded)
}
const sleepRestoredPerTick = (hoursOfSleepNeeded: number): number => {
    return (ticksPerHour * 24) / (hoursOfSleepNeeded)
}

const checkIfTimeForSleep = (hours: number, animal: AnimalThatSleeps) => {
    const {
        sleepStartTime = DEFAULT.sleepStartTime,
        wakeTime = DEFAULT.wakeTime,
    } = animal;
    return sleepStartTime < wakeTime
        ? hours >= sleepStartTime && hours < wakeTime
        : hours >= sleepStartTime || hours < wakeTime
}

const adjustSleepDebt = (that: AnimalThatSleeps): void => {
    const {
        hoursOfSleepNeeded = DEFAULT.hoursOfSleepNeeded,
    } = that

    if (that.data.isAsleep) {
        that.data.sleepDebt -= sleepRestoredPerTick(hoursOfSleepNeeded)
        that.data.sleepDebt = Math.max(0, that.data.sleepDebt)
    } else (
        that.data.sleepDebt += sleepDebtGainPerTickAwake(hoursOfSleepNeeded)
    )
}

export const manageSleeping = (that: AnimalThatSleeps) => (plan: SleepManagementPlan): void => {
    const {
        environment,
    } = that

    if (!environment) {
        return
    }
    const { hours } = environment.calendarTime
    const isTimeForSleep = checkIfTimeForSleep(hours, that);

    adjustSleepDebt(that)
    const { sleepDebt } = that.data

    if (that.data.isAsleep) {
        if (sleepDebt <= 0 || !isTimeForSleep) {
            that.data.isAsleep = false
            that.report(`${that.description} woke up`)
        }
    } else {
        if (isTimeForSleep && sleepDebt > 1) {
            that.data.isAsleep = true;
            that.report(`${that.description} fell asleep with ${sleepDebt.toFixed(4)} sleepDebt`);
        }
    }

}
