import { describe, expect, test, vi } from 'vitest'
import { useForecasts } from '.'

vi.mock('jotai', () => ({
  useAtomValue: () => ({
    currentLocation: {
      latitude: 0,
      longitude: 0,
    },
  }),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}))

vi.mock('../', () => ({
  useForecastsService: () => ({
    data: {
      latitude: 0,
      longitude: 0,
      current: {
        time: 'string',
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
  }),
}))

vi.mock('react', () => ({
  useMemo: vi.fn(),
}))

describe('useForecasts Hook', () => {
  describe('First visualization', () => {
    test.each([
      ['Bom dia,', 'morning', 7],
      ['Boa tarde,', 'evening', 15],
      ['Boa noite,', 'night', 19],
    ])('should return "%s" if its %s', (greeting, _, currentHour) => {
      const { getGreetings } = useForecasts()

      expect(getGreetings(currentHour)).toEqual(greeting)
    })

    test.each([
      ['Ensolarado e quente', 'clear-day', 27, 18],
      ['Parcialmente nublado e agradável', 'partly-cloudy-day', 21, 38],
      ['Parcialmente nublado e fresco', 'partly-cloudy-day', 18, 40],
      ['Nublado e ameno', 'cloudy', 14, 60],
      ['Nublado e frio', 'cloudy', 10, 78],
      ['Chuvoso ou nevando', 'rain', 5, 80],
    ])(
      'should return "%s" based on temperature and probability of precipitation',
      (conditionText, conditionType, temperature, precipitationProbability) => {
        const { getCurrentWeatherCondition } = useForecasts()

        expect(getCurrentWeatherCondition(temperature, precipitationProbability)).toEqual({
          text: conditionType,
          translation: conditionText,
        })
      }
    )
    test.todo('should return hourly weather forecast for given location')
    test.todo('should return correct icon for given temperature and condition')
  })

  describe('Second visualization (scroll down)', () => {
    test.todo('should return weather forecast for the next 7 days for given location')
    test.todo('should return UV index for given location')
    test.todo('should return sunset and sunrise for given location')
  })
})
