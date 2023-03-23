/* eslint-disable react/jsx-props-no-spreading */
import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    TextField,
} from '@mui/material'
import { useState } from 'react'
import { useSnackbar } from '../../../../components/snackbar'
import { apiUrl } from '../../../../config-global'
import axios from '../../../../utils/axios'

export default function VehicleAutocomplete({ setVehicle }: any) {
    const url = `${apiUrl}/vehicle/search/`

    const [open, setOpen] = useState(false)
    const [fetchLoader, setFetchLoader] = useState(false)
    const [items, setItems] = useState([])

    const { enqueueSnackbar } = useSnackbar()

    const handleChange = (val: any) => {
        setVehicle(val)
    }

    const fetchItems = async (e: any) => {
        try {
            // fetch attendants from api
            const { value } = e.target
            if (value?.trim() === '') return
            setFetchLoader(true)
            const { data } = await axios.get(`${url}${value}`)
            console.log(data)
            if (data.vehicles) {
                setItems(data.vehicles)
            } else {
                setItems([])
            }
        } catch (err: any) {
            const msg = err.error || err.message || 'Something went wrong'
            enqueueSnackbar(msg, { variant: 'error' })
        } finally {
            setFetchLoader(false)
        }
    }

    return (
        <Autocomplete
            id="vehicle-autocomplete"
            // sx={{ width: 300 }}
            open={open}
            onOpen={() => {
                setOpen(true)
            }}
            onClose={() => {
                setOpen(false)
            }}
            isOptionEqualToValue={(option: any, value: any) =>
                option.id === value.id
            }
            getOptionLabel={(option) => option.registration}
            options={items}
            loading={fetchLoader}
            onChange={(e, value) => {
                handleChange(value)
                // console.log(value, 'value')
            }}
            noOptionsText={
                <Box display="grid" gap={2} alignItems="center">
                    <p> No records found </p>
                    <Button> Add vehicle </Button>
                </Box>
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search vehicle"
                    onChange={fetchItems}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {fetchLoader ? (
                                    <CircularProgress
                                        color="inherit"
                                        size={20}
                                    />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    )
}