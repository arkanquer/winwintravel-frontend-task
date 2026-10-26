import { FilterType } from '../shared/api/types/Filter'
import type { SearchRequestFilter } from '../shared/api/types/SearchRequest/SearchRequestFilter'

export type FilterSelection = Record<string, string[]>

export const toggleFilter = (
	filters: FilterSelection,
	groupId: string,
	optionId: string
): FilterSelection => {
	const current = filters[groupId] ?? []
	const updated = current.includes(optionId)
		? current.filter(id => id !== optionId)
		: [...current, optionId]

	const next = { ...filters }
	if (updated.length === 0) {
		delete next[groupId]
	} else {
		next[groupId] = updated
	}
	return next
}

export const toSearchRequestFilters = (
	selection: FilterSelection
): SearchRequestFilter =>
	Object.entries(selection)
		.filter(([, optionsIds]) => optionsIds.length > 0)
		.map(([id, optionsIds]) => ({
			id,
			type: FilterType.OPTION,
			optionsIds: [...optionsIds]
		}))

export const fromSearchRequestFilters = (
	filters: SearchRequestFilter
): FilterSelection =>
	Object.fromEntries(filters.map(filter => [filter.id, [...filter.optionsIds]]))
