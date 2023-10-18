import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface AddressProps {
  road: string
  suburb: string
  city: string
  municipality: string
  county: string
  state_district: string
  state: string
  region: string
  postcode: string
  country: string
  country_code: string
}

function useAddressService(latitude: number, longitude: number) {
  const { data, isFetching } = useQuery({
    queryKey: ['getAddressBasedOnGivenCoords'],
    queryFn: () =>
      axios.get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`).then(({ data }) => data),
    select: (data) => (data.address as AddressProps) ?? '--',
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })

  return {
    data,
    isFetching,
  }
}

export { useAddressService }
