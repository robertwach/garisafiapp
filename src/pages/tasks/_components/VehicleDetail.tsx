import { Box, Button, Card, Link, Typography } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import useVehicle from '../../../hooks/vehicle/useVehicle'
import { PATH_DASHBOARD } from '../../../routes/paths'

function VehicleDetailCard({ id }: { id: string }) {
    const { vehicle } = useVehicle({ id })

    const Loader = (
        <Box>
            <Typography variant="h4">Loading...</Typography>
        </Box>
    )

    const ErrorCard = (
        <Box>
            <Typography variant="h4">Error loading vehicle detail</Typography>
        </Box>
    )

    return vehicle ? (
        <Box>
            <ErrorBoundary fallback={ErrorCard}>
                <Suspense fallback={Loader}>
                    <Box
                        rowGap={1}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                        }}
                    >
                        <Typography variant="h4">Vehicle Detail</Typography>

                        <Typography>
                            <b>Registration: </b>{' '}
                            <Button
                                component={Link}
                                href={PATH_DASHBOARD.systemData.vehilceDetails(
                                    vehicle.id
                                )}
                            >
                                {vehicle?.registration}
                            </Button>
                        </Typography>
                        <Typography>
                            <b>Model: </b> {vehicle?.model}
                        </Typography>
                        <Typography>
                            <b>Body type: </b> {vehicle?.bodyType?.name}
                        </Typography>
                    </Box>
                </Suspense>
            </ErrorBoundary>
        </Box>
    ) : (
        <div>{ErrorCard}</div>
    )
}

export default VehicleDetailCard
