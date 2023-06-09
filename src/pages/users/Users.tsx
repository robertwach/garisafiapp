/* eslint-disable no-param-reassign */
import {
    Button,
    Card,
    Container,
    IconButton,
    Table,
    TableBody,
    TableContainer,
    Tooltip,
} from '@mui/material'
import { Suspense, useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import { useSettingsContext } from '../../components/settings'
import useUsers from '../../hooks/user/userUsers'
import { PATH_DASHBOARD } from '../../routes/paths'
import { UserTableRow, UserTableToolbar } from '../../sections/user/list'

import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from '../../components/table'
import Scrollbar from '../../components/scrollbar'
import Page500 from '../Page500'
import { useSnackbar } from '../../components/snackbar'
import axiosInstance from '../../utils/axios'

const ROLE_OPTIONS = ['all', 'ADMIN', 'MANAGER', 'CASHIER']

const TABLE_HEAD = [
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'email', label: 'Email', align: 'left' },
    { id: 'role', label: 'Role', align: 'left' },
    { id: 'isVerified', label: 'Verified', align: 'center' },
    { id: 'status', label: 'Status', align: 'left' },
    { id: '', label: 'More' },
]

function Users() {
    const { themeStretch } = useSettingsContext()
    const navigate = useNavigate()
    const { users, mutate } = useUsers()

    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        //
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        //
        onSort,
        onChangeDense,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable({})

    const [tableData, setTableData] = useState(users)

    useEffect(() => {
        setTableData(users)
    }, [users])

    const [openConfirm, setOpenConfirm] = useState(false)

    const [filterName, setFilterName] = useState('')

    const [filterRole, setFilterRole] = useState('all')

    const [filterStatus, setFilterStatus] = useState('all')

    const { enqueueSnackbar } = useSnackbar()

    // useEffect(() => {
    //     console.log('setting users')
    //     //  setTableData(users)
    // }, [users])

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterRole,
        filterStatus,
    })

    const isFiltered =
        filterName !== '' || filterRole !== 'all' || filterStatus !== 'all'

    const dataInPage = dataFiltered.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    )

    const denseHeight = dense ? 52 : 72

    const isNotFound =
        (!dataFiltered.length && !!filterName) ||
        (!dataFiltered.length && !!filterRole) ||
        (!dataFiltered.length && !!filterStatus)

    const handleOpenConfirm = () => {
        setOpenConfirm(true)
    }

    const handleCloseConfirm = () => {
        setOpenConfirm(false)
    }

    const handleFilterStatus = (event: any, newValue: any) => {
        setPage(0)
        setFilterStatus(newValue)
    }

    const handleFilterName = (event: any) => {
        setPage(0)
        setFilterName(event.target.value)
    }

    const handleFilterRole = (event: any) => {
        setPage(0)
        setFilterRole(event.target.value)
    }

    const handleResetFilter = () => {
        setFilterName('')
        setFilterRole('all')
        setFilterStatus('all')
    }

    const handleDeleteRow = async (id: any) => {
        try {
            const response = await axiosInstance.delete(`/users/${id}`)
            if (response.status !== 200) {
                throw new Error(
                    response.data.error ||
                        response.data.msg ||
                        'Error deleting user'
                )
            }
            const deleteRow = tableData.filter((row: any) => row.id !== id)
            setSelected([])
            setTableData(deleteRow)

            if (page > 0) {
                if (dataInPage.length < 2) {
                    setPage(page - 1)
                }
            }
            mutate()
        } catch (err: any) {
            const msg = err.error || err.message || 'Error deleting user'
            enqueueSnackbar(msg, { variant: 'error' })
        }
    }

    // if (handleResetFilter !== null) {
    //     throw new Error('test error')
    // }

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="User List"
                links={[
                    { name: 'Dashboard', href: PATH_DASHBOARD.root },
                    { name: 'Users', href: PATH_DASHBOARD.users.root },
                    // { name: 'List' },
                ]}
                action={
                    <Button
                        component={RouterLink}
                        to={PATH_DASHBOARD.users.new}
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        New User
                    </Button>
                }
            />
            <ErrorBoundary fallback={<Page500 />}>
                <Suspense fallback={<div> Loading... </div>}>
                    <Card>
                        <UserTableToolbar
                            isFiltered={isFiltered}
                            filterName={filterName}
                            filterRole={filterRole}
                            optionsRole={ROLE_OPTIONS}
                            onFilterName={handleFilterName}
                            onFilterRole={handleFilterRole}
                            onResetFilter={handleResetFilter}
                        />

                        <TableContainer
                            sx={{ position: 'relative', overflow: 'unset' }}
                        >
                            <TableSelectedAction
                                dense={dense}
                                numSelected={selected.length}
                                rowCount={tableData.length}
                                onSelectAllRows={(checked: any) =>
                                    onSelectAllRows(
                                        checked,
                                        tableData.map((row: any) => row.id)
                                    )
                                }
                                action={
                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="primary"
                                            onClick={handleOpenConfirm}
                                        >
                                            <Iconify icon="eva:trash-2-outline" />
                                        </IconButton>
                                    </Tooltip>
                                }
                            />

                            <Scrollbar>
                                <Table
                                    size={dense ? 'small' : 'medium'}
                                    sx={{ minWidth: 800 }}
                                >
                                    <TableHeadCustom
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={tableData.length}
                                        numSelected={selected.length}
                                        onSort={onSort}
                                        onSelectAllRows={(checked: any) =>
                                            onSelectAllRows(
                                                checked,
                                                tableData.map(
                                                    (row: any) => row.id
                                                )
                                            )
                                        }
                                    />

                                    <TableBody>
                                        {dataFiltered
                                            .slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            )
                                            .map((row: any) => (
                                                <UserTableRow
                                                    key={row.id}
                                                    row={row}
                                                    selected={selected.includes(
                                                        row.id
                                                    )}
                                                    onSelectRow={() =>
                                                        onSelectRow(row.id)
                                                    }
                                                    onDeleteRow={() =>
                                                        handleDeleteRow(row.id)
                                                    }
                                                    onEditRow={
                                                        () =>
                                                            navigate(
                                                                PATH_DASHBOARD.users.edit(
                                                                    row.id
                                                                )
                                                            )
                                                        // handleEditRow(row.name)
                                                    }
                                                />
                                            ))}

                                        <TableEmptyRows
                                            height={denseHeight}
                                            emptyRows={emptyRows(
                                                page,
                                                rowsPerPage,
                                                tableData.length
                                            )}
                                        />

                                        <TableNoData isNotFound={isNotFound} />
                                    </TableBody>
                                </Table>
                            </Scrollbar>
                        </TableContainer>

                        <TablePaginationCustom
                            count={dataFiltered.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={onChangePage}
                            onRowsPerPageChange={onChangeRowsPerPage}
                            //
                            dense={dense}
                            onChangeDense={onChangeDense}
                        />
                    </Card>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}

function applyFilter({
    inputData,
    comparator,
    filterName,
    filterStatus,
    filterRole,
}: any) {
    const stabilizedThis = inputData.map((el: any, index: number) => [
        el,
        index,
    ])

    stabilizedThis.sort((a: any, b: any) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })

    inputData = stabilizedThis.map((el: any) => el[0])

    if (filterName) {
        inputData = inputData.filter(
            (user: any) =>
                user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        )
    }

    if (filterStatus !== 'all') {
        inputData = inputData.filter(
            (user: any) => user.status === filterStatus
        )
    }

    if (filterRole !== 'all') {
        inputData = inputData.filter((user: any) => user.role === filterRole)
    }

    return inputData
}

export default Users
