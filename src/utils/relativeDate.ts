enum RelativeDateUnit {
    SECOND = "second",
    MINUTE = "minute",
    HOUR = "hour",
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year",
}

/**
 * Returns a relative date string based on the given date and unit
 *
 * @param date Date to make relative
 * @param unit Unit of time to use for relative date
 * @returns Relative date string or null if date is invalid
 */
export function makeRelativeDate(
    date: Date,
    unit: RelativeDateUnit = RelativeDateUnit.DAY
): String | null {
    if (date === null || date === undefined) {
        return null;
    }

    // If type is not Date, return null
    if (Object.prototype.toString.call(date) !== "[object Date]") {
        return null;
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    switch (unit) {
        case RelativeDateUnit.SECOND:
            return `${seconds} seconds ago`;
        case RelativeDateUnit.MINUTE:
            return `${minutes} minutes ago`;
        case RelativeDateUnit.HOUR:
            return `${hours} hours ago`;
        case RelativeDateUnit.DAY:
            return `${days} days ago`;
        case RelativeDateUnit.WEEK:
            return `${weeks} weeks ago`;
        case RelativeDateUnit.MONTH:
            return `${months} months ago`;
        case RelativeDateUnit.YEAR:
            return `${years} years ago`;
        default:
            return "Invalid unit";
    }
}
