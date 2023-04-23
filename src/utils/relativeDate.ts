/**
 * Returns a relative date string based on the given date and unit
 *
 * @param date Date to make relative
 * @returns Relative date string or null if date is invalid
 */
export function makeRelativeDate(date?: Date | string): String | null {
    if (date === null || date === undefined) {
        return null;
    }

    // If type is not Date, parse
    if (typeof date === "string") {
        date = new Date(date);
    }

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
