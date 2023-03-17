/* eslint-disable react/jsx-props-no-spreading */
import * as Yup from 'yup'
import { Box, Button, Card, Container, Stack } from '@mui/material'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'

import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import { PATH_DASHBOARD } from '../../routes/paths'
import { useSnackbar } from '../../components/snackbar'
import { apiUrl } from '../../config-global'
import axios from '../../utils/axios'
import TaskForm from './_components/TaskForm'
import FormProvider from '../../components/hook-form'

const currentInvoice: any = {}

export default function NewTaskPage() {
    const { themeStretch } = useSettingsContext()
    const { enqueueSnackbar } = useSnackbar()

    const [open, setOpen] = useState(false)
    const [vehicleLoader, setVehicleLoader] = useState(false)
    const [vehicles, setVehicles] = useState<any>([])
    const [submitLoader, setSubmitLoader] = useState(false)
    const [vehicle, setVehicle] = useState<any>(null)

    const [loadingSave, setLoadingSave] = useState(false)

    const [loadingSend, setLoadingSend] = useState(false)

    const NewUserSchema = Yup.object().shape({
        createDate: Yup.string().nullable().required('Create date is required'),
        dueDate: Yup.string().nullable().required('Due date is required'),
        invoiceTo: Yup.mixed().nullable().required('Invoice to is required'),
    })

    const defaultValues = useMemo(
        () => ({
            invoiceNumber: currentInvoice?.invoiceNumber || '17099',
            createDate: currentInvoice?.createDate || new Date(),
            dueDate: currentInvoice?.dueDate || null,
            taxes: currentInvoice?.taxes || 0,
            status: currentInvoice?.status || 'draft',
            discount: currentInvoice?.discount || 0,
            invoiceFrom: currentInvoice?.invoiceFrom || '',
            invoiceTo: currentInvoice?.invoiceTo || null,
            items: currentInvoice?.items || [
                {
                    title: '',
                    description: '',
                    service: '',
                    quantity: 1,
                    price: 0,
                    total: 0,
                },
            ],
            totalPrice: currentInvoice?.totalPrice || 0,
        }),
        []
    )

    const methods: any = useForm({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
    })

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    const isEdit = false

    useEffect(() => {
        if (isEdit && currentInvoice) {
            reset(defaultValues)
        }
        if (!isEdit) {
            reset(defaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentInvoice])

    const fetchVehicles = async (e: any) => {
        try {
            const query = e.target.value
            if (query.length <= 0) {
                return
            }
            setVehicleLoader(true)
            const res = await axios(`${apiUrl}/vehicle/search/${query}`)
            const data = await res.data
            setVehicles(data?.vehicles ?? [])
        } catch (err: any) {
            const msg = err.error || err.message || 'Error loading vehicles'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setVehicleLoader(false)
        }
    }

    const createTask = () => {
        console.log(vehicle, 'vehicle')
    }

    const handleCreateAndSend = async (data: any) => {
        console.log('data', data)
    }

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <ErrorBoundary
                fallback={<InternalError error="Error loading tasks" />}
            >
                <CustomBreadcrumbs
                    heading="Tasks"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        {
                            name: 'tasks',
                            href: PATH_DASHBOARD.tasks.root,
                        },
                        {
                            name: 'New tasks',
                            href: PATH_DASHBOARD.tasks.new,
                        },
                    ]}
                    // action={
                    //     <Button
                    //         onClick={() => setOpen(true)}
                    //         variant="contained"
                    //         startIcon={<Iconify icon="eva:plus-fill" />}
                    //     >
                    //         New Task
                    //     </Button>
                    // }
                />

                <Suspense fallback={<p>Loading...</p>}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            <Autocomplete
                                id="vehicle-autocomplete"
                                sx={{ width: 300 }}
                                open={open}
                                onOpen={() => {
                                    setOpen(true)
                                }}
                                onClose={() => {
                                    setOpen(false)
                                }}
                                isOptionEqualToValue={(
                                    option: any,
                                    value: any
                                ) => option.registration === value.registration}
                                getOptionLabel={(option) => option.registration}
                                options={vehicles}
                                loading={vehicleLoader}
                                onChange={(e, value) => setVehicle(value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search vehicle"
                                        onChange={fetchVehicles}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {vehicleLoader ? (
                                                        <CircularProgress
                                                            color="inherit"
                                                            size={20}
                                                        />
                                                    ) : null}
                                                    {
                                                        params.InputProps
                                                            .endAdornment
                                                    }
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Box>

                        {/* <Stack
                            sx={{ mt: 3 }}
                            spacing={2}
                            direction={{ xs: 'column-reverse', md: 'row' }}
                            alignItems={{ xs: 'flex-center', md: 'center' }}
                        >
                            <Button variant="outlined">Add service</Button>
                        </Stack> */}
                        <FormProvider methods={methods}>
                            <Card>
                                <TaskForm />
                            </Card>

                            <Stack
                                justifyContent="flex-end"
                                direction="row"
                                spacing={2}
                                sx={{ mt: 3 }}
                            >
                                <LoadingButton
                                    color="inherit"
                                    size="large"
                                    variant="contained"
                                    loading={loadingSave && isSubmitting}
                                    onClick={handleSubmit(handleCreateAndSend)}
                                >
                                    Save as Draft
                                </LoadingButton>

                                <LoadingButton
                                    size="large"
                                    variant="contained"
                                    loading={loadingSend && isSubmitting}
                                    onClick={handleSubmit(handleCreateAndSend)}
                                >
                                    {isEdit ? 'Update' : 'Create'} & Send
                                </LoadingButton>
                            </Stack>
                        </FormProvider>
                    </Card>

                    <Stack display="flex" alignItems="flex-end" sx={{ mt: 3 }}>
                        <LoadingButton
                            onClick={createTask}
                            loading={submitLoader}
                            variant="contained"
                        >
                            Create task
                        </LoadingButton>
                    </Stack>
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}
