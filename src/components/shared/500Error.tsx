/* eslint-disable react/require-default-props */
import { m } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
// @mui
import { Button, Typography } from '@mui/material'
// components
import { MotionContainer, varBounce } from '../animate'
// assets
import { SeverErrorIllustration } from '../../assets/illustrations'

// ----------------------------------------------------------------------
interface ErrorProps {
    error: string
    resetErrorBoundary?: any
}

export default function InternalError({
    error,
    resetErrorBoundary,
}: ErrorProps) {
    // console.log('actual error', error)
    const navigate = useNavigate()
    return (
        <MotionContainer
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <m.div variants={varBounce({}).in}>
                <Typography variant="h3" paragraph>
                    500 Internal Server Error
                </Typography>
            </m.div>

            <m.div variants={varBounce({}).in}>
                <Typography sx={{ color: 'text.secondary' }}>
                    {error || 'There was an error, please try again later.'}
                </Typography>
            </m.div>

            <m.div variants={varBounce({}).in}>
                <SeverErrorIllustration
                    sx={{ height: 260, my: { xs: 5, sm: 10 } }}
                />
            </m.div>

            <Button
                onClick={() => {
                    // navigate(-1)
                    // window.location.p
                    resetErrorBoundary()
                    // window.history.back()
                }}
                size="large"
                variant="contained"
            >
                Go Back
            </Button>
        </MotionContainer>
    )
}
// component={RouterLink}
// to="/"
