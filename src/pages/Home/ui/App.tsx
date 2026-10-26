import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterModal } from '../../../components/FilterModal/FilterModal'
import { useFilterStore } from '../../../store/filterStore.ts'

export const App = () => {
	const { t } = useTranslation('filter')

	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const filters = useFilterStore(state => state.filters)

	return (
		<main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 p-6">
			<h1 className="text-4xl font-semibold text-gray-700">{t('appTitle')}</h1>

			<button
				type="button"
				onClick={() => setIsFilterOpen(true)}
				className="rounded-lg bg-blue-600 px-6 py-3 text-white"
			>
				{t('title')}
			</button>

			<section className="w-full">
				<h2 className="mb-3 text-xl font-semibold">{t('selected')}</h2>

				<pre className="overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm">
					{JSON.stringify(filters, null, 2)}
				</pre>
			</section>

			{isFilterOpen && <FilterModal onClose={() => setIsFilterOpen(false)} />}
		</main>
	)
}
