import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useUser({ id }: { id: number }) {
    const url = `${apiUrl}/users/${id}`

    const { error, data, mutate } = useSWR(url)

    return {
        loading: !error && !data,
        error,
        user: data ? data.user : null,
        mutate,
    }
}
