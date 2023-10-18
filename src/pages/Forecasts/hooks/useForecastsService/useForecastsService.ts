import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface WeatherForecastProps {
  latitude: number
  longitude: number
  current: {
    time: string
    interval: number
    temperature_2m: number
    apparent_temperature: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: number[]
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: number[]
    uv_index_max: number[]
    sunrise: string[]
    sunset: string[]
  }
}

function useForecastsService(latitude: number, longitude: number) {
  const { data, isFetching } = useQuery({
    queryKey: ['useForecastsService'],
    queryFn: () =>
      axios
        .get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature&hourly=temperature_2m,precipitation_probability&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset&timezone=America/Sao_Paulo`
        )
        .then(({ data }) => data as WeatherForecastProps),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  })

  return {
    data,
    isFetching,
  }
}

export { useForecastsService }
export type { WeatherForecastProps }
