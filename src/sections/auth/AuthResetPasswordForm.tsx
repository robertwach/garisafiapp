import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
// @mui
import { LoadingButton } from '@mui/lab'
// routes
import { PATH_AUTH } from '../../routes/paths'
// components
import FormProvider, { RHFTextField } from '../../components/hook-form'

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {
    const navigate = useNavigate()

    const ResetPasswordSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required')
            .email('Email must be a valid email address'),
    })

    const methods = useForm({
        resolver: yupResolver(ResetPasswordSchema),
        defaultValues: { email: 'demo@garisafi.com' },
    })

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    const onSubmit = async (data: any) => {
        try {
            // eslint-disable-next-line no-promise-executor-return, @typescript-eslint/no-implied-eval
            await new Promise((resolve: any) => setTimeout(resolve, 500))
            sessionStorage.setItem('email-recovery', data.email)
            navigate(PATH_AUTH.newPassword)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <RHFTextField name="email" label="Email address" />

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{ mt: 3 }}
            >
                Send Request
            </LoadingButton>
        </FormProvider>
    )
}
