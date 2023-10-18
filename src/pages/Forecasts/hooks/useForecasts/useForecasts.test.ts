import { describe, expect, test, vi } from 'vitest'
import { WeatherConditionProps, useForecasts } from '.'

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

    test('should return hourly weather forecast', () => {
      const { getHourlyWeatherForecast } = useForecasts()
      const { timeArray, temperatures, currentHourPosition, nextMidNightDate } = {
        timeArray: ['2022-10-18T01:00', '2022-10-18T02:00'],
        temperatures: [12, 13],
        currentHourPosition: 0,
        nextMidNightDate: '2022-10-18T02:00',
      }

      expect(getHourlyWeatherForecast(timeArray, temperatures, currentHourPosition, nextMidNightDate)).toEqual([
        {
          hour: '01',
          icon: '/src/assets/cloudy.svg',
          temperature: 12,
        },
      ])
    })

    test.each([
      ['clear-day' as WeatherConditionProps, '/src/assets/day.svg'],
      ['clear-night' as WeatherConditionProps, '/src/assets/night.svg'],
      ['rain' as WeatherConditionProps, '/src/assets/rainy-6.svg'],
      ['snow' as WeatherConditionProps, '/src/assets/snowy-5.svg'],
      ['sleet' as WeatherConditionProps, '/src/assets/snowy-6.svg'],
      ['cloudy' as WeatherConditionProps, '/src/assets/cloudy.svg'],
      ['partly-cloudy-day' as WeatherConditionProps, '/src/assets/cloudy-day-3.svg'],
      ['partly-cloudy-night' as WeatherConditionProps, '/src/assets/cloudy-night-3.svg'],
    ])(
      'should return correct icon if weather condition is "%s"',
      (conditionText: WeatherConditionProps, expectedIcon) => {
        const { getWeatherConditionIcon } = useForecasts()

        expect(getWeatherConditionIcon(conditionText)).toEqual(expectedIcon)
      }
    )
  })

  describe('Second visualization (scroll down)', () => {
    test.todo('should return weather forecast for the next 7 days for given location')
    test.todo('should return UV index for given location')
    test.todo('should return sunset and sunrise for given location')
  })
})
