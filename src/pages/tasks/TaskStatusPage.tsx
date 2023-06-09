/* eslint-disable @typescript-eslint/no-use-before-define */
import { Box, Button, Container, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useParams, useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import CustomBreadcrumbs from '../../components/custom-breadcrumbs'
import Iconify from '../../components/iconify'
import { useSettingsContext } from '../../components/settings'
import InternalError from '../../components/shared/500Error'
import useTaskByStatus from '../../hooks/task/useTaskStatus'
import { PATH_DASHBOARD } from '../../routes/paths'
import TasksTable from './_components/TasksTable'

function TaskByStatusPage() {
    const { themeStretch } = useSettingsContext()

    const [searchParams] = useSearchParams()
    const initialStartDate = searchParams.get('startDate')

    const dateQueryStr = `${format(
        initialStartDate ? new Date(initialStartDate) : new Date(),
        'yyyy-MM-dd'
    )}`

    const { status } = useParams()
    const q = status ?? 'all'
    const { tasks, mutate } = useTaskByStatus({
        query: `status=${q}&startDate=${dateQueryStr}`,
    })

    useEffect(() => {
        fetchTasks()
    }, [status])

    const fetchTasks = async () => {
        //  console.log('Fetching tasks')
    }

    // console.log(tasks, status, 'tasks')
    console.log('tasks status', dateQueryStr)

    return (
        <Container maxWidth={themeStretch ? false : 'xl'}>
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
                            name: `${status || ''} tasks`,
                            href: PATH_DASHBOARD.tasks.root,
                        },
                    ]}
                />

                <Grid container>
                    <Grid item xs={12}>
                        <TasksTable
                            data={tasks}
                            mutate={mutate}
                            handleUpdate={() => ''}
                        />
                    </Grid>
                </Grid>
            </ErrorBoundary>
        </Container>
    )
}

export default TaskByStatusPage
