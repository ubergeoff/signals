export function dateAdd(
    date: Date,
    interval: 'hours' | 'minutes' | 'seconds',
    units: number
): Date {
    if (!(date instanceof Date)) {
        return new Date();
    }
    const ret = new Date(date); //don't change original date

    switch (interval) {
        case 'hours':
            ret.setTime(ret.getTime() + units * 3600000);
            break;
        case 'minutes':
            ret.setTime(ret.getTime() + units * 60000);
            break;
        case 'seconds':
            ret.setTime(ret.getTime() + units * 1000);
            break;
    }
    return ret;
}
