import { lazy } from 'react'
import RoleBasedGuard from '../../auth/RoleBasedGuard'
import Loadable from '../../components/loaderble'
import {
    ADMIN_ROLE,
    CASHIER_ROLE,
    MANAGER_ROLE,
    ROLES,
} from '../../utils/roles'

export const ServicesPage = Loadable(lazy(() => import('./ProductsPage')))

export const productRoutes = [
    {
        path: 'products',
        element: (
            <RoleBasedGuard
                roles={[ADMIN_ROLE, CASHIER_ROLE, MANAGER_ROLE]}
                module={ROLES.Attendants}
                hasContent
            >
                <ServicesPage />
            </RoleBasedGuard>
        ),
    },
]
