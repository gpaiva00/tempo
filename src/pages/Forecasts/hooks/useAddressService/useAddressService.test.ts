import { useQuery } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react-hooks'
import { describe, expectTypeOf, test, vi } from 'vitest'
import { WeatherForecastProps, useForecastsService } from '..'

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}))

describe('Hook useForecastsService', () => {
  test('should return address based on given coords', () => {
    useQuery.mockReturnValue({
      data: {
        latitude: 0,
        longitude: 0,
        current: {
          time: '',
          interval: 0,
          temperature_2m: 0,
          apparent_temperature: 0,
        },
        hourly: {
          time: [''],
          temperature_2m: [0],
          precipitation_probability: [0],
        },
        daily: {
          time: [''],
          temperature_2m_max: [0],
          temperature_2m_min: [0],
          precipitation_probability_max: [0],
          uv_index_max: [0],
          sunrise: [''],
          sunset: [''],
        },
      },
      isFetching: false,
    })

    const { result } = renderHook(() => useForecastsService(0, 0))

    expectTypeOf<WeatherForecastProps>(result.current.data).toMatchTypeOf<WeatherForecastProps>()
  })
})
