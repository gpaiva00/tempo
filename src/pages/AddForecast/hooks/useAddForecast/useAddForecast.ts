import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { currentLocationAtom } from '../../../Forecasts/hooks'
import { useSearchAddressService } from '../useSearchAddressService'

/*
 *  Hook responsible to add and search locations
 */
function useAddForecast() {
  const [location, setLocation] = useState('')
  const [isFetchingEnabled, setIsFetchingEnabled] = useState(false)

  const { data, isFetching } = useSearchAddressService(location, isFetchingEnabled)

  const navigate = useNavigate()
  const setAtom = useSetAtom(currentLocationAtom)

  function handleSearchLocation() {
    setIsFetchingEnabled(true)
  }

  function handleChooseLocation(latitude: string, longitude: string, label: string) {
    setAtom({
      latitude: Number(latitude),
      longitude: Number(longitude),
      label,
    })

    navigate('/')
  }

  useEffect(() => {
    if (data?.length) setIsFetchingEnabled(false)
  }, [data])

  return {
    handleSearchLocation,
    location,
    data,
    isFetching,
    handleLocationChange: setLocation,
    handleChooseLocation,
    handleGoBack: () => navigate('/'),
  }
}

export { useAddForecast }
