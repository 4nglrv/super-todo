export const localStorageMiddleware = ({ getState }: any) => {
	return (next: any) => (action: any) => {
		const result = next(action)
		localStorage.setItem('applicationState', JSON.stringify(getState()))
		return result
	}
}

export const reHydrateStore = () => {
	if (localStorage.getItem('applicationState') === null) return
  if (window.navigator.onLine) {
    localStorage.removeItem('applicationState')
    return
  }
  return JSON.parse(localStorage.getItem('applicationState') as string)
}