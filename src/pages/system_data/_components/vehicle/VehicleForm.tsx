/* eslint-disable react/jsx-props-no-spreading */
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useMemo, useState } from 'react'
import {
    Box,
    Button,
    Stack,
    Autocomplete,
    Chip,
    TextField,
    Checkbox,
    FormControlLabel,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import FormProvider, {
    RHFCheckbox,
    RHFSelect,
    RHFSwitch,
    RHFTextField,
    RHFUploadAvatar,
} from '../../../../components/hook-form'
import { useSnackbar } from '../../../../components/snackbar'
import { useAuthContext } from '../../../../auth/useAuthContext'
import { ADMIN_ROLE } from '../../../../utils/roles'

function VehicleForm({
    vehicle,
    onSubmit,
    loading,
    handleClose,
    clients,
    bodyTypes,
}: any) {
    const { enqueueSnackbar } = useSnackbar()
    const { user }: any = useAuthContext()

    const [newClient, setNewClient] = useState(false)

    const NewVehicleSchema = Yup.object().shape({
        registration: Yup.string().required('Vehicle registration required'),
        clientId: Yup.string(),
        bodyId: Yup.string().required('Body type required'),
        model: Yup.string(),
        points: Yup.number().required('Reward points required'),
        clientName: Yup.string(),
        clientPhone: Yup.string(),
    })

    const defaultValues = useMemo(
        () => ({
            registration: vehicle?.registration || '',
            clientId: vehicle?.clientId || '',
            bodyId: vehicle?.bodyId || '',
            model: vehicle?.model || '',
            points: vehicle?.points?.points || 0,
            clientName: vehicle?.clientName || '',
            clientPhone: vehicle?.clientPhone || '',
        }),
        [vehicle]
    )
    const isEdit = vehicle?.id && vehicle.id !== ''

    const methods = useForm({
        resolver: yupResolver(NewVehicleSchema),
        defaultValues,
    })

    const {
        handleSubmit,
        control,
        setValue,
        formState: { isSubmitting },
    } = methods

    // console.log(user)

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box
                sx={{ pt: 3 }}
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                }}
            >
                <RHFTextField
                    autoComplete="off"
                    name="registration"
                    label="Registration"
                />

                <RHFTextField autoComplete="off" name="model" label="Model" />

                <RHFSelect native name="bodyId" label="Body type">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <option value="" defaultValue="" />
                    {bodyTypes.map((type: any) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </RHFSelect>

                <RHFTextField
                    type="number"
                    autoComplete="off"
                    name="points"
                    disabled={isEdit && user?.role !== ADMIN_ROLE}
                    label="Reward points"
                />

                <div>
                    <FormControlLabel
                        label="New client"
                        control={
                            <Checkbox
                                onChange={(e: any) => {
                                    setNewClient(e.target.checked)
                                    console.log(e.target.checked)
                                }}
                                name="isAvailable"
                                value={newClient}
                            />
                        }
                    />
                </div>
                {newClient ? (
                    <>
                        <RHFTextField
                            type="text"
                            autoComplete="off"
                            name="clientName"
                            label="Client name"
                        />

                        <RHFTextField
                            type="text"
                            autoComplete="off"
                            name="clientPhone"
                            label="Client phone"
                        />
                    </>
                ) : (
                    <RHFSelect native name="clientId" label="Select client">
                        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                        <option value="" defaultValue="" />
                        {clients.map((client: any) => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </RHFSelect>
                )}
            </Box>

            <Stack alignItems="flex-end " sx={{ mt: 3 }}>
                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        paddingBottom: '8px',
                    }}
                >
                    <Button
                        variant="outlined"
                        disabled={loading}
                        onClick={handleClose}
                        color="warning"
                    >
                        Cancel
                    </Button>

                    <LoadingButton
                        loading={isSubmitting}
                        type="submit"
                        variant="contained"
                    >
                        {!isEdit ? 'Save' : 'Save Changes'}
                    </LoadingButton>
                </div>
            </Stack>
        </FormProvider>
    )
}

export default VehicleForm
