import { useDataStore } from './useDataStore'
import { useMemo, useEffect, useState } from 'react'

export const useAllSettings = ({ global = false, ignoreUpdates = false } = {}) => {
    const dataStore = useDataStore()

    const settingsStore = global ? dataStore?.globalSettings : dataStore?.userSettings
    const [value, setValue] = useState(settingsStore?.settings)

    const callbacks = useMemo(() => ({
        set: (key: string, value: any) => settingsStore?.set(key, value),
    }), [dataStore])

    useEffect(() => {
        if (!ignoreUpdates) {
            const callback = (newSettings: Record<string,any>) => setValue(newSettings)
            settingsStore?.subscribeAll(callback)
            return () => settingsStore?.unsubscribeAll(callback)
        }
    }, [settingsStore, ignoreUpdates])
    
    return [value, callbacks]
}