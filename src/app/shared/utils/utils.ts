export const  getPreviousWeekdayDate = function() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
    const daysToSubtract = (dayOfWeek === 0 ? 2 : (dayOfWeek === 1 ? 3 : 1));
    const previousWeekdayDate = new Date(today.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));
    return previousWeekdayDate;
  }

