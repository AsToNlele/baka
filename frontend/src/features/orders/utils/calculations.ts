export const calculateQRString = (
    receiver_iban: string,
    variableSymbol: number,
    amount: number
) => {
    return `SPD:1.0*ACC:${receiver_iban}*AM:${amount}*CC:CZK*PT:IP*X-VS:${variableSymbol}*`
}
