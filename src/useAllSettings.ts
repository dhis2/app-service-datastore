import { useDataStore } from './useDataStore'
import { useEffect, useState, useCallback } from 'react'

export const useAllSettings = ({
    global = false,
    ignoreUpdates = false,
} = {}) => {
    const dataStore = useDataStore()

    const settingsStore = global
        ? dataStore?.globalSettings
        : dataStore?.userSettings
    const [value, setValue] = useState(settingsStore?.settings)

    const set = useCallback(
        (key: string, value: any) => settingsStore?.set(key, value),
        [settingsStore]
    )

    useEffect(() => {
        if (!ignoreUpdates) {
            const callback = (newSettings: Record<string, any>) =>
                setValue(newSettings)
            settingsStore?.subscribeAll(callback)
            return () => settingsStore?.unsubscribeAll(callback)
        }
    }, [settingsStore, ignoreUpdates])

    return [
        value,
        {
            set,
        },
    ]
}
