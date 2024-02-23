export const calculateQRString = (
    BIC: string,
    variableSymbol: number,
    amount: number
) => {
    return `SPD:1.0*ACC:${calculateIBANfromBIC(
        BIC
    )}*AM:${amount}*CC:CZK*PT:IP*X-VS:${variableSymbol}*`
}
export const calculateIBANfromBIC = (bic: string) => {
    const account = bic.split("/")
    const code = account[1].trim()
    const acc = account[0].split("-")
    if (!acc[1]) {
        acc[1] = acc[0]
        acc[0] = "000000"
    }
    acc[0] = acc[0].replace(/[^0-9]/g, "")
    acc[1] = acc[1].replace(/[^0-9]/g, "")
    const accountX =
        new Array(7 - acc[0].length).join("0") +
        acc[0] +
        new Array(11 - acc[1].length).join("0") +
        acc[1]
    const accountY =
        accountX.substr(0, 4) +
        // " " +
        accountX.substr(4, 4) +
        // " " +
        accountX.substr(8, 4) +
        // " " +
        accountX.substr(12, 4)
    let working_IBAN =
        code +
        // " " +
        accountY +
        12 +
        35 +
        0 +
        0
    working_IBAN = working_IBAN.replace(/ /g, "")
    let ai = 1
    let ch = working_IBAN.charCodeAt(working_IBAN.length - 1) - 48
    console.log("CH", ch)
    let check
    if (!(ch < 0 || ch > 9)) {
        check = ch
        let i
        for (i = working_IBAN.length - 2; i >= 0; i--) {
            ch = working_IBAN.charCodeAt(i) - 48
            if (ch < 0 || ch > 9) break
            ai = (ai * 10) % 97
            check += ai * ch
        }
        check = 98 - (check % 97)
        if (check < 10) check = "0" + check
    }
    const IBAN =
        "CZ" +
        check +
        // " "
        +code +
        // + " "
        accountY
    return IBAN
}
