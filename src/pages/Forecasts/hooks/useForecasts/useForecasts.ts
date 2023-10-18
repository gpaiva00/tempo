import { useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForecastsService } from '../'

import { Cloudy, CloudyDay3, CloudyNight3, Day, Night, Rainy6, Snowy5, Snowy6 } from '../../../../assets/'
import { getNextMidNight } from '../../../../utils'

enum WeatherConditionProps {
  CLEAR_DAY = 'clear-day',
  CLEAR_NIGHT = 'clear-night',
  RAIN = 'rain',
  SNOW = 'snow',
  SLEET = 'sleet',
  CLOUDY = 'cloudy',
  PARTLY_CLOUDY_DAY = 'partly-cloudy-day',
  PARTLY_CLOUDY_NIGHT = 'partly-cloudy-night',
}

const currentLocationAtom = atomWithStorage('currentLocation', {
  latitude: 0,
  longitude: 0,
  label: '--',
})

/*
 * Hook responsible to manage forecasts data
 */
function useForecasts() {
  const currentLocation = useAtomValue(currentLocationAtom)

  const navigate = useNavigate()

  const { data: weatherForecast, isFetching: isWeatherForecastFetching } = useForecastsService(
    currentLocation.latitude,
    currentLocation.longitude
  )

  const currentHourPosition = useMemo(
    () => getCurrentHourPositionInsideTimeArray(weatherForecast?.hourly?.time ?? []),
    [weatherForecast?.hourly?.time]
  )

  function getUVIndex(uvIndexMax: number) {
    const uvIndex = {
      index: uvIndexMax,
      label: '',
    }

    if (uvIndexMax < 3) {
      uvIndex.label = 'baixo'
    } else if (uvIndexMax < 6) {
      uvIndex.label = 'moderado'
    } else if (uvIndexMax < 8) {
      uvIndex.label = 'alto'
    } else if (uvIndexMax < 11) {
      uvIndex.label = 'muito alto'
    } else {
      uvIndex.label = 'extremo'
    }

    return uvIndex
  }

  function getPrecipitationProbabilityWeatherForecast(timeArray: string[], precipitationProbabilityArray: number[]) {
    const nextMidNightDate = getNextMidNight()
    const nextMidNightInTimeArray = timeArray.indexOf(nextMidNightDate)

    const newTimeArray = [...timeArray].splice(currentHourPosition, nextMidNightInTimeArray)
    const newPrecipitationProbabilityArray = [...precipitationProbabilityArray].splice(
      currentHourPosition,
      nextMidNightInTimeArray
    )

    return newTimeArray.map((time, timeIndex) => {
      const timeInDate = new Date(time)
      const currentHour = new Date().getHours()

      return {
        hour: currentHour === timeInDate.getHours() ? 'Agora' : timeInDate.getHours().toString().padStart(2, '0'),
        probability: newPrecipitationProbabilityArray[timeIndex],
      }
    })
  }

  function getWeatherForecastForNextDays(dailyWeatherForecast: typeof weatherForecast.daily) {
    const today = new Date().getDate()

    return dailyWeatherForecast?.time.map((day, index) => {
      const dayNumber = new Date(day).getDate() + 1
      const icon = getWeatherConditionIcon(
        getCurrentWeatherCondition(
          dailyWeatherForecast.temperature_2m_max[index],
          dailyWeatherForecast?.precipitation_probability_max[index] ?? 0
        ).text
      )

      return {
        maxTemperature: dailyWeatherForecast.temperature_2m_max[index],
        minTemperature: dailyWeatherForecast.temperature_2m_min[index],
        day: dayNumber === today ? 'Hoje' : dayNumber,
        icon,
      }
    })
  }

  function getSunriseAndSunsetHour(dailyWeatherForecast: typeof weatherForecast.daily) {
    const sunrise = dailyWeatherForecast?.sunrise[0].split('T')[1] ?? ''
    const sunset = dailyWeatherForecast?.sunset[0].split('T')[1] ?? ''

    return {
      sunrise,
      sunset,
    }
  }

  function getHourlyWeatherForecast(
    timeArray: string[],
    temperatures: number[],
    currentHourPosition: number,
    nextMidNightDate: string
  ) {
    const nextMidNightInTimeArray = timeArray.indexOf(nextMidNightDate)

    const newTimeArray = [...timeArray].splice(currentHourPosition, nextMidNightInTimeArray)
    const newTemperaturesArray = [...temperatures].splice(currentHourPosition, nextMidNightInTimeArray)

    return newTimeArray.map((time, timeIndex) => {
      const timeInDate = new Date(time)
      const currentHour = new Date().getHours()
      const icon = getWeatherConditionIcon(
        getCurrentWeatherCondition(
          newTemperaturesArray[timeIndex],
          weatherForecast?.hourly.precipitation_probability[currentHourPosition] ?? 0
        ).text
      )

      return {
        hour: currentHour === timeInDate.getHours() ? 'Agora' : timeInDate.getHours().toString().padStart(2, '0'),
        icon,
        temperature: newTemperaturesArray[timeIndex],
      }
    })
  }

  function getCurrentHourPositionInsideTimeArray(timeArray: string[]): number {
    const currentDate = new Date()
    const currentDateTimestamp = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}T${currentDate
      .getHours()
      .toString()
      .padStart(2, '0')}:00`

    return timeArray.indexOf(currentDateTimestamp)
  }

  function getCurrentWeatherCondition(temperature: number, probabilityOfPrecipitation: number) {
    const conditionMap = {
      text: '' as WeatherConditionProps,
      translation: '',
    }

    if (temperature > 25 && probabilityOfPrecipitation < 20) {
      conditionMap.translation = 'Ensolarado e quente'
      conditionMap.text = WeatherConditionProps.CLEAR_DAY
    } else if (temperature > 20 && probabilityOfPrecipitation < 40) {
      conditionMap.translation = 'Parcialmente nublado e agradável'
      conditionMap.text = WeatherConditionProps.PARTLY_CLOUDY_DAY
    } else if (temperature > 15 && probabilityOfPrecipitation < 60) {
      conditionMap.translation = 'Parcialmente nublado e fresco'
      conditionMap.text = WeatherConditionProps.PARTLY_CLOUDY_DAY
    } else if (temperature > 10 && probabilityOfPrecipitation < 70) {
      conditionMap.translation = 'Nublado e ameno'
      conditionMap.text = WeatherConditionProps.CLOUDY
    } else if (temperature > 5 && probabilityOfPrecipitation < 80) {
      conditionMap.translation = 'Nublado e frio'
      conditionMap.text = WeatherConditionProps.CLOUDY
    } else if (temperature <= 5 || probabilityOfPrecipitation >= 80) {
      conditionMap.translation = 'Chuvoso ou nevando'
      conditionMap.text = WeatherConditionProps.RAIN
    } else {
      conditionMap.translation = 'Condições indefinidas'
      conditionMap.text = WeatherConditionProps.CLEAR_DAY
    }

    return conditionMap
  }

  function getWeatherForecastForTheDay(maxTemperature: number, minTemperature: number, maxUVIndex: number): string {
    const temperatureAverage = (maxTemperature + minTemperature) / 2

    if (temperatureAverage > 25 && maxUVIndex > 2) {
      return 'será um dia quente e ensolarado, perfeito para curtir ao ar livre. Não se esqueça do protetor solar!'
    } else if (temperatureAverage > 20 && maxUVIndex > 1) {
      return 'temperaturas agradáveis estão previstas, aproveite o dia com um bom passeio ao ar livre.'
    } else if (temperatureAverage > 15) {
      return 'o clima estará ameno, ideal para atividades ao ar livre com possíveis nuvens passageiras.'
    } else if (temperatureAverage > 10) {
      return 'está fresco lá fora, um bom dia para uma caminhada leve.'
    } else if (temperatureAverage > 5) {
      return 'o dia estará frio, vista-se bem se planeja sair. Uma xícara de café quente pode ser reconfortante.'
    } else if (temperatureAverage <= 5) {
      return 'faz bastante frio hoje, esteja preparado para possíveis chuvas ou até mesmo neve.'
    } else {
      return 'as condições do dia são indefinidas, melhor se preparar para surpresas meteorológicas.'
    }
  }

  function getGreetings(currentHour: number): string {
    if (currentHour >= 5 && currentHour < 12) {
      return 'Bom dia,'
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Boa tarde,'
    } else {
      return 'Boa noite,'
    }
  }

  function getWeatherConditionIcon(condition: WeatherConditionProps) {
    const icons = {
      'clear-day': Day,
      'clear-night': Night,
      rain: Rainy6,
      snow: Snowy5,
      sleet: Snowy6,
      cloudy: Cloudy,
      'partly-cloudy-day': CloudyDay3,
      'partly-cloudy-night': CloudyNight3,
    }

    return icons[condition] ?? null
  }

  return {
    getCurrentWeatherCondition,
    getWeatherForecastForTheDay,
    getGreetings,
    getWeatherConditionIcon,
    getHourlyWeatherForecast,
    currentLocation,
    weatherForecast,
    isWeatherForecastFetching,
    currentLocationAtom,
    currentHourPosition,
    hourlyWeatherForecast: getHourlyWeatherForecast(
      weatherForecast?.hourly?.time ?? [],
      weatherForecast?.hourly?.temperature_2m ?? [],
      currentHourPosition,
      getNextMidNight()
    ),
    greetingsText: getGreetings(new Date().getHours()),
    getSunriseAndSunsetHour,
    sunriseAndSunsetHour: getSunriseAndSunsetHour(weatherForecast?.daily),
    uvIndex: getUVIndex(weatherForecast?.daily.uv_index_max[0] ?? 0),
    weatherForecastForNextDays: getWeatherForecastForNextDays(weatherForecast?.daily),
    precipitationProbability: getPrecipitationProbabilityWeatherForecast(
      weatherForecast?.hourly.time ?? [],
      weatherForecast?.hourly.precipitation_probability ?? []
    ),
    handleGoToAddForecast: () => navigate('add-forecast'),
  }
}

export { currentLocationAtom, useForecasts }
export type { WeatherConditionProps }
