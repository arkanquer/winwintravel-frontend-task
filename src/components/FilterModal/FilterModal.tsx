import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useQuery } from '@tanstack/react-query'

import type { FilterItem } from '../../shared/api/types/Filter'
import filterData from '../../shared/temp/filterData.json'
import { useFilterStore } from '../../store/filterStore.ts'
import {
	type FilterSelection,
	fromSearchRequestFilters,
	toSearchRequestFilters,
	toggleFilter
} from '../../utils/filters.ts'

type FilterModalProps = {
	onClose: () => void
}

export const FilterModal = ({ onClose }: FilterModalProps) => {
	const { t } = useTranslation('filter')
	const savedFilters = useFilterStore(state => state.filters)
	const setFilters = useFilterStore(state => state.setFilters)
	const [selected, setSelected] = useState<FilterSelection>(() =>
		fromSearchRequestFilters(savedFilters)
	)
	const [showConfirmation, setShowConfirmation] = useState(false)
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const confirmCancelRef = useRef<HTMLButtonElement>(null)

	const { data, isLoading, isError } = useQuery<FilterItem[]>({
		queryKey: ['filters'],
		queryFn: async () => filterData.filterItems as FilterItem[]
	})

	useEffect(() => {
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		const previousFocus = document.activeElement as HTMLElement | null
		closeButtonRef.current?.focus()
		return () => {
			document.body.style.overflow = previousOverflow
			previousFocus?.focus()
		}
	}, [])

	useEffect(() => {
		if (showConfirmation) {
			confirmCancelRef.current?.focus()
		}
	}, [showConfirmation])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault()
				if (showConfirmation) {
					setShowConfirmation(false)
				} else {
					onClose()
				}
			}
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [showConfirmation, onClose])

	const handleChange = (groupId: string, optionId: string) => {
		setSelected(previous => toggleFilter(previous, groupId, optionId))
	}

	const handleConfirm = () => {
		setFilters(toSearchRequestFilters(selected))
		setShowConfirmation(false)
		onClose()
	}

	return (
		<div
			role="dialog"
			aria-modal={!showConfirmation}
			aria-labelledby="filter-title"
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
		>
			<section className="flex max-h-[90vh] w-full max-w-[760px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
				<header className="relative flex shrink-0 items-center justify-center border-b border-gray-200 px-6 py-4">
					<h2
						id="filter-title"
						className="text-lg font-semibold text-gray-800"
					>
						{t('title')}
					</h2>
					<button
						ref={closeButtonRef}
						type="button"
						onClick={onClose}
						aria-label={t('close')}
						className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-gray-900"
					>
						{'×'}
					</button>
				</header>

				<div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
					{isLoading && <p>{t('loading')}</p>}
					{isError && <p>{t('error')}</p>}
					{data?.map(group => (
						<fieldset
							key={group.id}
							className="mb-5 border-b border-gray-200 pb-5 last:mb-0 last:border-b-0"
						>
							<legend className="text-sm font-semibold text-gray-800">
								{group.name}
							</legend>
							{group.description && (
								<p className="mt-1 text-xs text-gray-500">
									{group.description}
								</p>
							)}
							<div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-3">
								{group.options.map(option => (
									<label
										key={option.id}
										className="flex cursor-pointer items-start gap-2"
									>
										<input
											type="checkbox"
											checked={(selected[group.id] ?? []).includes(option.id)}
											onChange={() => handleChange(group.id, option.id)}
											className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-orange-500"
										/>
										<span className="text-xs font-medium text-gray-700">
											{option.name}
										</span>
									</label>
								))}
							</div>
						</fieldset>
					))}
				</div>

				<footer className="relative flex shrink-0 items-center justify-center border-t border-gray-200 px-6 py-4">
					<button
						type="button"
						onClick={() => setShowConfirmation(true)}
						disabled={isLoading || isError}
						className="rounded-md bg-orange-500 px-9 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
					>
						{t('apply')}
					</button>
					<button
						type="button"
						onClick={() => setSelected({})}
						className="absolute right-6 text-xs text-cyan-600 hover:underline"
					>
						{t('clearAll')}
					</button>
				</footer>
			</section>

			{showConfirmation && (
				<div
					role="alertdialog"
					aria-modal="true"
					aria-labelledby="confirm-title"
					className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
				>
					<section className="relative w-full max-w-md rounded-lg bg-white px-8 py-7 text-center shadow-xl">
						<button
							type="button"
							onClick={() => setShowConfirmation(false)}
							aria-label={t('close')}
							className="absolute right-4 top-3 text-lg text-gray-500"
						>
							{'×'}
						</button>
						<h3
							id="confirm-title"
							className="text-base font-medium text-gray-800"
						>
							{t('confirmTitle')}
						</h3>
						<div className="mt-7 flex justify-center gap-4">
							<button
								ref={confirmCancelRef}
								type="button"
								onClick={() => setShowConfirmation(false)}
								className="rounded-md border border-gray-300 px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								{t('cancel')}
							</button>
							<button
								type="button"
								onClick={handleConfirm}
								className="rounded-md bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600"
							>
								{t('apply')}
							</button>
						</div>
					</section>
				</div>
			)}
		</div>
	)
}
