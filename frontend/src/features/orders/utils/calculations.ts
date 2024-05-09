// Author: Alexandr Celakovsky - xcelak00
export const calculateQRString = (
    receiver_iban: string,
    variableSymbol: number,
    amount: number
) => {
    // Follows the standard for QR payments in the Czech Republic
    // https://cbaonline.cz/format-pro-sdileni-platebnich-udaju-v-czk-qr-kody
    return `SPD:1.0*ACC:${receiver_iban}*AM:${amount}*CC:CZK*PT:IP*X-VS:${variableSymbol}*`
}
