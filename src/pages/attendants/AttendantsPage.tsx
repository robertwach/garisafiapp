import {
    Button,
    Card,
    CardContent,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from '@mui/material'
import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import { useSnackbar } from '../../components/snackbar'
import useAttendantList from '../../hooks/attendant/useAttendantList'
import { PATH_DASHBOARD } from '../../routes/paths'
import axios from '../../utils/axios'
import AttendantForm from './_components/AttendantForm'
import AttendantsTable from './_components/AttendantsTable'
import { fCurrency } from '../../utils/formatNumber'

function AttendantsPage() {
    const { themeStretch } = useSettingsContext()
    const { attendants, mutate } = useAttendantList()
    const [open, setOpen] = useState(false)
    const [activeAttendant, setActiveAttendant] = useState<any>(null)

    const { enqueueSnackbar } = useSnackbar()

    const handleClose = () => {
        setOpen(false)
        setActiveAttendant(null)
    }

    const handleUpdate = async (data: any) => {
        try {
            setActiveAttendant(data)
            setOpen(true)
        } catch (err: any) {
            enqueueSnackbar(err.message, { variant: 'error' })
        }
    }

    const onSubmit = async (payload: any) => {
        try {
            if (activeAttendant && activeAttendant.id) {
                // update record
                const { data } = await axios.put(
                    `/attendant/${activeAttendant.id}`,
                    payload
                )
                if (data) {
                    mutate()
                    enqueueSnackbar('Attendant updated successfully', {
                        variant: 'success',
                    })
                    setOpen(false)
                    setActiveAttendant(null)
                }
            } else {
                // update record
                const { data } = await axios.post('/attendant', payload)
                if (data) {
                    mutate()
                    enqueueSnackbar('Attendant added successfully', {
                        variant: 'success',
                    })
                    setOpen(false)
                    setActiveAttendant(null)
                }
            }
        } catch (err: any) {
            enqueueSnackbar(err.message || 'Opearation failed', {
                variant: 'error',
            })
        }
    }

    const totalCommision = attendants.reduce((acc: any, curr: any) => {
        const currCommission = curr.commissions.reduce((a: any, c: any) => {
            return a + c.amount
        }, 0)
        return acc + currCommission
    }, 0)
    const totalTips = attendants.reduce((acc: any, curr: any) => {
        const currTips =
            curr?.tips.reduce((a: any, c: any) => {
                return a + c.amount
            }, 0) ?? 0
        return acc + currTips
    }, 0)

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <ErrorBoundary
                fallback={
                    <InternalError error="Error loading attendants data" />
                }
            >
                <CustomBreadcrumbs
                    heading="Attendants"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        {
                            name: 'Attendants',
                            href: PATH_DASHBOARD.attendants.root,
                        },
                    ]}
                    action={
                        <Button
                            onClick={() => setOpen(true)}
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                            New attendant
                        </Button>
                    }
                />

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4} xl={3}>
                        <Card sx={{ my: 4 }}>
                            <CardContent>
                                <Typography variant="h6" color="info">
                                    Commission not paid
                                </Typography>
                                <Typography variant="h4" color="info">
                                    {fCurrency(totalCommision)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4} xl={3}>
                        <Card sx={{ my: 4 }}>
                            <CardContent>
                                <Typography variant="h6" color="info">
                                    Tips not submitted
                                </Typography>
                                <Typography variant="h4" color="info">
                                    {fCurrency(totalTips)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <AttendantsTable
                    data={attendants}
                    mutate={mutate}
                    handleUpdate={handleUpdate}
                />

                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>Add attendant</DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText /> */}

                        <AttendantForm
                            onSubmit={onSubmit}
                            attendant={activeAttendant}
                            handleClose={handleClose}
                        />
                    </DialogContent>
                </Dialog>
            </ErrorBoundary>
        </Container>
    )
}

export default AttendantsPage
