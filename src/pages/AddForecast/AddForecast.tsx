import { CaretCircleLeft, CaretRight, CircleNotch, MagnifyingGlass } from '@phosphor-icons/react'
import classNames from 'classnames'
import { useAddForecast } from './hooks/useAddForecast'

/*
 * Page to add location address to check the weather forecast
 */
function AddForecast() {
  const { handleSearchLocation, location, handleLocationChange, handleChooseLocation, data, isFetching, handleGoBack } =
    useAddForecast()

  return (
    <div className="relative flex w-full flex-col px-20 py-10">
      <header className="flex items-center justify-between">
        <button
          onClick={handleGoBack}
          className="transition-colors hover:text-gray-500"
        >
          <CaretCircleLeft
            size={24}
            weight="bold"
          />
        </button>
      </header>

      <section className="flex h-screen flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold">Pesquisar local</h1>
          <p className="text-lg">Pesquise por endereço, cidade ou estado</p>
          <div className="mt-4 flex items-center gap-2">
            <input
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              type="text"
              className="w-[300px] rounded-lg border border-gray-200 px-4 py-2 ring-blue-400"
              placeholder="Ex: Acre"
            />
            <button
              onClick={handleSearchLocation}
              className="h-full rounded-lg border border-gray-200 bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              {isFetching ? (
                <CircleNotch
                  size={24}
                  className="animate-spin"
                />
              ) : (
                <MagnifyingGlass size={24} />
              )}
            </button>
          </div>
        </div>

        {!data?.length && <p className="text-gray-500">Os resultados aparecerão aqui.</p>}
        {data && data.length > 0 && (
          <div className="flex max-h-[300px] w-[800px] flex-col overflow-y-scroll">
            {data?.map(({ lat, lon, display_name }, index) => {
              const formattedDisplayName = display_name.split(',').slice(0, 3).join(',')
              const label = display_name.split(',')[0]

              return (
                <button
                  key={index}
                  onClick={() => handleChooseLocation(lat, lon, label)}
                  className={classNames('flex w-full items-center justify-between py-4 hover:font-semibold', {
                    'border-b border-b-gray-200': index !== data.length - 1,
                  })}
                >
                  <p>{formattedDisplayName}</p>
                  <CaretRight />
                </button>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default AddForecast
