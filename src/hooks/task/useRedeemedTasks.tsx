import useSWR from 'swr'
import { apiUrl } from '../../config-global'

export default function useRedeemedTasks({ query }: { query: string }) {
    // console.log('query', query) { query }: { query?: string }
    // console.log(query, 'query')
    const url = `${apiUrl}/task/redeemed-report?${query}`
    const { error, data, mutate } = useSWR(url, { suspense: true })

    return {
        loading: !error && !data,
        error,
        tasks: data ? data.tasks : [],
        mutate,
    }
}
