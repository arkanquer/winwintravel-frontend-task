import { create } from 'zustand'

import type { SearchRequestFilter } from '../shared/api/types/SearchRequest/SearchRequestFilter'

type FilterStore = {
	filters: SearchRequestFilter
	setFilters: (filters: SearchRequestFilter) => void
}

export const useFilterStore = create<FilterStore>(set => ({
	filters: [],
	setFilters: filters => set({ filters })
}))
