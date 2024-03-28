import { format, isValid, parseISO } from "date-fns"

export const dateFormat = "dd.MM.yyyy"
export const formatDate = (date: Date | undefined) =>
    date && isValid(date) ? format(date, dateFormat) : ""

export const parseIsoAndFormat = (date: string) => formatDate(parseISO(date))

export const upperCaseFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
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
