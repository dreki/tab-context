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
    date?: Date | string
    // unit: RelativeDateUnit = RelativeDateUnit.DAY
): String | null {
    if (date === null || date === undefined) {
        return null;
    }

    // If type is not Date, parse
    if (typeof date === "string") {
        date = new Date(date);
    }
    // if (Object.prototype.toString.call(date) !== "[object Date]") {
    //     return null;
    // }

    // const now = new Date();
    // // const diff = now.getTime() - date.getTime();
    // const diff = date.getTime() - now.getTime();
    // const formatter = new Intl.RelativeTimeFormat("en", {
    //     numeric: "auto",
    // });

    // Allow dates or times to be passed
    const timeMs = typeof date === "number" ? date : date.getTime();

    // Get the amount of seconds between the given date and now
    const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

    // Array reprsenting one minute, hour, day, week, month, etc in seconds
    const cutoffs = [
        60,
        3600,
        86400,
        86400 * 7,
        86400 * 30,
        86400 * 365,
        Infinity,
    ];

    // Array equivalent to the above but in the string representation of the units
    const units: Intl.RelativeTimeFormatUnit[] = [
        "second",
        "minute",
        "hour",
        "day",
        "week",
        "month",
        "year",
    ];

    // Grab the ideal cutoff unit
    const unitIndex = cutoffs.findIndex(
        (cutoff) => cutoff > Math.abs(deltaSeconds)
    );

    // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
    // is one day in seconds, so we can divide our seconds by this to get the # of days
    const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

    // Intl.RelativeTimeFormat do its magic
    const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    return formatter.format(
        Math.floor(deltaSeconds / divisor),
        units[unitIndex]
    );

    // Return relative string in the appropriate units. So if the date is 2 days ago, return "2 days
    // ago". If the date is 10 minutes ago, return "10 minutes ago".

    /*

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
    } */
}

/**
 * Returns a friendly date string based on the given date.
 *
 * Format is "Monday, January 1, 2021 at 12:00 AM"
 *
 * @param date Date to make friendly
 * @returns Friendly date string or null if date is invalid
 */
export function makeFriendlyDate(date?: Date | string): String | null {
    if (date === null || date === undefined) {
        return null;
    }

    // If type is not Date, parse
    if (typeof date === "string") {
        date = new Date(date);
    }

    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
}
