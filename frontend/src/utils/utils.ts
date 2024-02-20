import { format, isValid, parseISO } from "date-fns"

export const dateFormat = "dd.MM.yyyy"
export const formatDate = (date: Date | undefined) =>
    date && isValid(date) ? format(date, dateFormat) : ""

export const parseIsoAndFormat = (date: string) => formatDate(parseISO(date))

export const upperCaseFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
