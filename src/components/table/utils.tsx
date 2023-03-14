// ----------------------------------------------------------------------

export function emptyRows(page: any, rowsPerPage: any, arrayLength: any) {
    return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0
}

function descendingComparator(a: any, b: any, orderBy: any) {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

export function getComparator(order: any, orderBy: any) {
    return order === 'desc'
        ? (a: any, b: any) => descendingComparator(a, b, orderBy)
        : (a: any, b: any) => -descendingComparator(a, b, orderBy)
}
