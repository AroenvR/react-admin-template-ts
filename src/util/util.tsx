/**
 * Checks if the given data or object is truthy. https://developer.mozilla.org/en-US/docs/Glossary/Truthy
 * @param data The data, object or array to check.
 * @returns true if TRUTHY and false if FALSY.
 */
 export const isTruthy = (data: any): boolean => {
    // Checking for falsy objects. https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
    if (data && Object.getOwnPropertyNames(data).length === 0 && Object.getPrototypeOf(data) === Object.prototype) return false;

    if (Array.isArray(data)) {
        if (data.length === 0) return false;

        for (const foo of data) {
            if (isTruthy(foo)) return true;
        }

        // 'data' is an array but all elements are falsy.
        return false;
    }

    if (typeof(data) === 'string' && data.length === 0) return false;

    if (typeof(data) === 'undefined' || data === null) return false;

    if (data === 0) return true;

    if (!data) return false;

    return true;
}

/**
 * Formats a millisecond timestamp to a date and time string.
 * @param timeStamp millisecond value of a date.
 * @returns string representation -> DAY day/month/year - hour:minute:second
 */
export const timeStampToString = (timeStamp: number): string => {
    let days = { 
        0: "Sunday", 
        1: "Monday", 
        2: "Tuesday", 
        3: "Wednesday", 
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    };
    let dayString = days[new Date(timeStamp).getDay()];

    let day = new Date(timeStamp).getDate();

    let month = new Date(timeStamp).getMonth() + 1;

    let year = new Date(timeStamp).getFullYear();

    let time = new Date(timeStamp).toString().split(" ")[4];

    // Add a second digit to day and month incase necessary.    
    return `${dayString} ${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year} - ${time}`;
}