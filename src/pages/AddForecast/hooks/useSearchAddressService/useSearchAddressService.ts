import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface SearchAddressProps {
  place_id: number
  lat: string
  lon: string
  display_name: string
  importance: number
}

function useSearchAddressService(location: string, enabled: boolean) {
  const { data, isFetching } = useQuery({
    queryKey: ['getAddressBasedOnGivenCoords'],
    queryFn: () =>
      axios.get(`https://geocode.maps.co/search?q=${location}`).then(({ data }) => data as SearchAddressProps[]),
    refetchOnWindowFocus: false,
    keepPreviousData: false,
    enabled,
  })

  return {
    data,
    isFetching,
  }
}

export { useSearchAddressService }
