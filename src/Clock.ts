export class Clock {
    readonly secondsPerTick: number

    constructor(secondsPerTick: number) {
        this.secondsPerTick = secondsPerTick
    }

    get ticksPerDay() {
        return (24 * 60 * 60) / this.secondsPerTick
    }

    giveCalendarTime(time: number) {
        const totalSeconds = time * this.secondsPerTick;
        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const secondsToday = totalSeconds % (24 * 60 * 60);
        const hours = Math.floor(secondsToday / (60 * 60));
        const minutesAndSecondsInSeconds = secondsToday % (60 * 60);
        const minutes = Math.floor(minutesAndSecondsInSeconds / 60);
        const seconds = minutesAndSecondsInSeconds % 60;
        return { days, hours, minutes, seconds };
    }

    giveTimeOfDay(time: number) {
        const { hours } = this.giveCalendarTime(time);
        if (hours < 4) {
            return "night";
        } else if (hours < 8) {
            return "dawn";
        } else if (hours < 18) {
            return "day";
        } else if (hours < 22) {
            return "dusk";
        }
        return "night";
    }

}