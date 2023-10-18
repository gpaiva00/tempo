import { describe, test } from 'vitest'

describe('useForecasts Hook', () => {
  describe('First visualization', () => {
    test('should return correct welcome text based on current hour, maxTemperature, minTemperature and maxUVIndex', () => {})
    test.todo('should return location name if user granted access to it')
    test.todo('should return weather temperature for given location')
    test.todo('should return current weather condition based on temperature and probability of precipitation')
    test.todo('should return hourly weather forecast for given location')
    test.todo('should return correct icon for given temperature and condition')
  })

  describe('Second visualization (scroll down)', () => {
    test.todo('should return weather forecast for the next 7 days for given location')
    test.todo('should return UV index for given location')
    test.todo('should return sunset and sunrise for given location')
  })

  describe('My locations', () => {
    test.todo('should save location')
    test.todo('should return saved locations')
    test.todo('should delete given location')
  })
})
