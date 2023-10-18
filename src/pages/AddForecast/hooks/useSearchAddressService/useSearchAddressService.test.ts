import { useQuery } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react-hooks'
import { describe, expect, expectTypeOf, test, vi } from 'vitest'
import { SearchAddressProps, useSearchAddressService } from '.'

const locationMap = {
  SAO_PAULO: {
    location: 'São Paulo',
    expectedCoords: {
      latitude: '-23.123',
      longitude: '42.123',
    },
  },
}

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}))

describe('Hook useForecastsService', () => {
  test('should return coords based on given address', () => {
    useQuery.mockReturnValue({
      data: [
        {
          place_id: 0,
          lat: '-23.123',
          lon: '42.123',
          display_name: 'São Paulo',
          importance: 0,
        },
      ],
      isFetching: false,
    })

    const {
      result: {
        current: { data },
      },
    } = renderHook(() => useSearchAddressService(locationMap.SAO_PAULO.location, true))

    expectTypeOf<SearchAddressProps[] | undefined>(data).toMatchTypeOf<SearchAddressProps[] | undefined>()

    if (data) {
      expect(data[0].lat).toEqual(locationMap.SAO_PAULO.expectedCoords.latitude)
      expect(data[0].lon).toEqual(locationMap.SAO_PAULO.expectedCoords.longitude)
    }
  })
})
