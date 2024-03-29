import numeral from 'numeral'

// ----------------------------------------------------------------------
function result(format: any, key = '.00') {
    const isInteger: any = format.includes(key)
    return isInteger ? format.replace(key, '') : format
}

export function fNumber(number: any) {
    return numeral(number).format()
}

export function fCurrency(number: any) {
    const f = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
    })

    return f.format(number)
    // const format = number ? numeral(number).format('Ksh0,0.00') : ''

    // return result(format, '.00')
}

export function fPercent(number: any) {
    const format = number ? numeral(Number(number) / 100).format('0.0%') : ''

    return result(format, '.0')
}

export function fShortenNumber(number: any) {
    const format = number ? numeral(number).format('0.00a') : ''

    return result(format, '.00')
}

export function fData(number: any) {
    const format = number ? numeral(number).format('0.0 b') : ''

    return result(format, '.0')
}
