import { format, isValid, parseISO } from "date-fns"

export const dateFormat = "dd.MM.yyyy"
export const dateTimeFormat = "dd.MM.yyyy HH:mm"
export const formatDate = (date: Date | undefined) =>
    date && isValid(date) ? format(date, dateFormat) : ""

export const formatDateTime = (date: Date | undefined) =>
    date && isValid(date) ? format(date, dateTimeFormat) : ""

export const parseIsoAndFormat = (date: string) => formatDate(parseISO(date))
export const parseIsoAndFormatDateTime = (date: string) =>
    formatDateTime(parseISO(date))

export const parseIsoAndFormatInputDate = (date: string) =>
    format(parseISO(date), "yyyy-MM-dd")

export const upperCaseFirstLetter = (string : string) => {
    const altString = string ?? "  "
    return altString.charAt(0).toUpperCase() + altString.slice(1)
}

export const dayNumberToDay = (dayNumber: number) => {
    switch (dayNumber) {
        case 0:
            return "Sunday"
        case 1:
            return "Monday"
        case 2:
            return "Tuesday"
        case 3:
            return "Wednesday"
        case 4:
            return "Thursday"
        case 5:
            return "Friday"
        case 6:
            return "Saturday"
        default:
            return "Unknown"
    }
}

export const formatTime = (timeString: string) => {
    const date = new Date(
        0,
        0,
        0,
        parseInt(timeString.split(":")[0]),
        parseInt(timeString.split(":")[1]),
    )
    return format(date, "HH:mm")
    // const [hours, minutes] = timeString.split(":")
    // return new Date(0, 0, 0, parseInt(hours), parseInt(minutes))
}

export const inSameTimePeriod = (date1: string, date2: string) => {
    const convertedDate1 = parseISO(date1).setMilliseconds(0)
    const convertedDate2 = parseISO(date2).setMilliseconds(0)
    return convertedDate1 === convertedDate2
}

export const imageUrl = (image: string | undefined) => {
    if (!image) {
        return ""
    }
    const origin = window.location.origin
    return `${origin}/api/media/${image}`
}
    
