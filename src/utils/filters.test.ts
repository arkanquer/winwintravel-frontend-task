import { describe, expect, it } from 'vitest'

import { FilterType } from '../shared/api/types/Filter'
import {
	fromSearchRequestFilters,
	toSearchRequestFilters,
	toggleFilter
} from './filters'

describe('toggleFilter', () => {
	it('adds a selected option', () => {
		expect(toggleFilter({}, 'MEAL_OPTIONS', 'breakfast')).toEqual({
			MEAL_OPTIONS: ['breakfast']
		})
	})
	it('allows selecting multiple options', () => {
		expect(
			toggleFilter({ MEAL_OPTIONS: ['breakfast'] }, 'MEAL_OPTIONS', 'dinner')
		).toEqual({
			MEAL_OPTIONS: ['breakfast', 'dinner']
		})
	})
	it('removes an already selected option', () => {
		expect(
			toggleFilter(
				{ MEAL_OPTIONS: ['breakfast', 'dinner'] },
				'MEAL_OPTIONS',
				'breakfast'
			)
		).toEqual({
			MEAL_OPTIONS: ['dinner']
		})
	})
	it('removes empty groups', () => {
		expect(
			toggleFilter({ MEAL_OPTIONS: ['breakfast'] }, 'MEAL_OPTIONS', 'breakfast')
		).toEqual({})
	})
	it('does not mutate its input', () => {
		const before = { MEAL_OPTIONS: ['breakfast'] }
		toggleFilter(before, 'MEAL_OPTIONS', 'dinner')
		expect(before).toEqual({ MEAL_OPTIONS: ['breakfast'] })
	})
})

describe('API conversion', () => {
	it('converts selected options to the official API format', () => {
		expect(
			toSearchRequestFilters({
				MEAL_OPTIONS: ['breakfast'],
				FACILITIES: ['parking']
			})
		).toEqual([
			{
				id: 'MEAL_OPTIONS',
				type: FilterType.OPTION,
				optionsIds: ['breakfast']
			},
			{ id: 'FACILITIES', type: FilterType.OPTION, optionsIds: ['parking'] }
		])
	})
	it('omits empty groups', () => {
		expect(
			toSearchRequestFilters({ MEAL_OPTIONS: [], FACILITIES: ['parking'] })
		).toEqual([
			{ id: 'FACILITIES', type: FilterType.OPTION, optionsIds: ['parking'] }
		])
	})
	it('converts saved filters back to checkbox state', () => {
		expect(
			fromSearchRequestFilters([
				{
					id: 'MEAL_OPTIONS',
					type: FilterType.OPTION,
					optionsIds: ['breakfast']
				}
			])
		).toEqual({ MEAL_OPTIONS: ['breakfast'] })
	})
})
