import { useDataStore } from './useDataStore'
import { useMemo, useEffect, useState } from 'react'

const flattenDictionary = (dict?: Record<string, object>) => dict && Object.entries(dict).map(([id, obj]) => ({
    id,
    ...obj
}))

export const useSavedObjectList = ({ global = false, ignoreUpdates = false } = {}) => {
    const dataStore = useDataStore()

    const objectStore = global ? dataStore?.globalSavedObjects : dataStore?.userSavedObjects
    const [list, setList] = useState(flattenDictionary(objectStore?.settings))

    const callbacks = useMemo(() => ({
        add: (object: object) => objectStore?.add(object),
        update: (id: string, object: object) => objectStore?.update(id, object),
        replace: (id: string, object: object) => objectStore?.replace(id, object),
        remove: (id: string) => objectStore?.remove(id)
    }), [dataStore])

    useEffect(() => {
        if (!ignoreUpdates) {
            const callback = (newSettings: Record<string, object>) => setList(flattenDictionary(newSettings))
            objectStore?.subscribeAll(callback)
            return () => objectStore?.unsubscribeAll(callback)
        }
    }, [objectStore, ignoreUpdates])
    
    return [list, callbacks]
}