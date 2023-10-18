import { Sun, SunHorizon, Sunglasses, ThermometerHot } from '@phosphor-icons/react'

import classNames from 'classnames'
import { Card } from './components'
import { useForecasts } from './hooks'
/*
 * Page to show weather forecasts based on selected location
 */
function Forecasts() {
  const {
    currentLocation: { label },
    weatherForecast,
    getCurrentWeatherCondition,
    currentHourPosition,
    getWeatherForecastForTheDay,
    hourlyWeatherForecast,
    greetingsText,
    sunriseAndSunsetHour,
    uvIndex,
    weatherForecastForNextDays,
    precipitationProbability,
    isSidebarVisible,
    toggleSidebar,
    handleGoToAddForecast,
  } = useForecasts()

  return (
    <div className="flex w-full flex-col px-20 py-10">
      {/* First Visualization */}
      <div className="flex h-screen w-full flex-col pb-10">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <b className="text-4xl font-black">{greetingsText}</b>
            <p className="max-w-sm text-gray-500">
              {getWeatherForecastForTheDay(
                weatherForecast?.daily.temperature_2m_max[0] ?? 0,
                weatherForecast?.daily.temperature_2m_min[0] ?? 0,
                weatherForecast?.daily.uv_index_max[0] ?? 0
              )}
            </p>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={handleGoToAddForecast}
              className="rounded-lg border border-blue-500 px-4 py-2 text-blue-500 transition-colors hover:bg-blue-500 hover:text-white"
            >
              Pesquisar local
            </button>
          </div>
        </header>

        <section className="flex h-screen flex-col items-center pb-10">
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <h1 className="flex items-start bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-9xl font-bold text-transparent">
              {weatherForecast?.current.temperature_2m ?? '--'}
              <span className="self-start text-6xl">º</span>
            </h1>
            <p className="text-lg text-gray-500">{label !== '--' ? label : `Meu local (${label})`}</p>
            <p className="text-lg">
              {
                getCurrentWeatherCondition(
                  weatherForecast?.current?.temperature_2m ?? 0,
                  weatherForecast?.hourly.precipitation_probability[currentHourPosition] ?? 0
                ).translation
              }
            </p>
          </div>

          <Card className="defaultGradient flex w-full items-center overflow-y-hidden overflow-x-scroll p-4">
            <div className="flex items-center gap-8 py-4">
              {hourlyWeatherForecast.map(({ hour, temperature, icon }) => (
                <div className="flex w-full flex-col items-center gap-2">
                  <p className="text-sm text-white">{hour}</p>
                  <img
                    src={icon}
                    width={50}
                    height={50}
                  />
                  <b className="text-white">{temperature}º</b>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
      {/* Second Visualization */}
      <div className="flex gap-4">
        <Card className="max-h-[600px] w-full bg-gradient-to-b from-blue-50 to-blue-100 p-4">
          <p className="border-b border-b-gray-200 pb-2 uppercase">Previsão para os próximos dias</p>

          <div className="flex w-full flex-col">
            {weatherForecastForNextDays?.map(({ day, minTemperature, maxTemperature, icon }, index) => (
              <div
                key={index}
                className={classNames('flex w-full items-center justify-between gap-4 py-1', {
                  'border-b border-b-gray-200': index !== weatherForecastForNextDays.length - 1,
                })}
              >
                <b>{day}</b>
                <img
                  src={icon}
                  alt="cloudy"
                />
                <p>
                  {minTemperature}º <span className="text-gray-500">mínima</span>
                </p>
                <b>
                  {maxTemperature}º <span className="font-normal text-gray-500">máxima</span>
                </b>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Card className="flex h-44 w-40 flex-col justify-between p-4">
              <p className="text-sm uppercase">Nascer do Sol</p>
              <Sun
                weight="fill"
                className="flex self-center"
                size={50}
              />
              <b className="text-2xl font-bold">{sunriseAndSunsetHour.sunrise}</b>
            </Card>
            <Card className="flex h-44 w-40 flex-col justify-between p-4">
              <p className="text-sm uppercase">Pôr do Sol</p>
              <SunHorizon
                className="flex self-center"
                weight="fill"
                size={50}
              />
              <b className="text-2xl font-bold">{sunriseAndSunsetHour.sunset}</b>
            </Card>
          </div>

          <Card className="flex h-44 flex-col justify-between p-4">
            <p className="text-sm uppercase">Índice de UV</p>
            <Sunglasses
              className="flex self-center"
              weight="fill"
              size={60}
            />
            <b className="text-2xl font-bold">
              {uvIndex.index} <span className="font-normal text-gray-500">{uvIndex.label}</span>
            </b>
          </Card>
          <Card className="flex h-44 flex-col justify-between p-4">
            <p className="text-sm uppercase">Sensação térmica</p>
            <ThermometerHot
              className="flex self-center"
              weight="fill"
              size={60}
            />
            <b className="text-2xl font-bold">{weatherForecast?.current.apparent_temperature}º</b>
          </Card>
        </div>

        <Card className="max-h-[600px] w-full overflow-y-scroll bg-gradient-to-b from-blue-50 to-blue-100 p-4">
          <p className="border-b border-b-gray-200 pb-2 uppercase">Chances de chuva</p>

          <div className="flex w-full flex-col">
            {precipitationProbability.map(({ hour, probability }, index) => (
              <div
                key={index}
                className={classNames('flex w-full items-center justify-between gap-4 py-8', {
                  'border-b border-b-gray-200': index !== precipitationProbability.length - 1,
                })}
              >
                <p>{hour}</p>
                <div className="h-4 w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-300/50 to-blue-300/20">
                  <div
                    className="h-full rounded-lg bg-blue-500 transition-all"
                    style={{ width: `${probability}%` }}
                  />
                </div>
                <b className="flex items-end gap-1">
                  {probability} <span className="text-gray-500">%</span>
                </b>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Forecasts
