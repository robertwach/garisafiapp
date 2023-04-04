import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import { ADMIN_ROLE, MANAGER_ROLE } from '../../utils/roles'

export const PaymentPage = Loadable(lazy(() => import('./PaymentPage')))

export const paymentRoutes = [
    {
        path: 'payments',
        element: (
            <RoleBasedGuard roles={[ADMIN_ROLE]} hasContent>
                <PaymentPage />
            </RoleBasedGuard>
        ),
    },
]