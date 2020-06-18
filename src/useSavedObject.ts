import { useDataStore } from './useDataStore'
import { useMemo, useEffect, useState } from 'react'

export const useSavedObject = (id: string, { ignoreUpdates = false } = {}) => {
    const dataStore = useDataStore()

    const global = !dataStore?.userSavedObjects.has(id)
    const objectStore = global
        ? dataStore?.globalSavedObjects
        : dataStore?.userSavedObjects
    const [value, setValue] = useState<object>(objectStore?.get(id))

    const callbacks = useMemo(
        () => ({
            update: (object: object) => objectStore?.update(id, object),
            replace: (object: object) => objectStore?.replace(id, object),
            remove: () => objectStore?.remove(id),
            share: () => dataStore?.shareSavedObject(id),
            unshare: () => dataStore?.unshareSavedObject(id),
        }),
        [dataStore, id, objectStore]
    )

    useEffect(() => {
        if (!ignoreUpdates) {
            const callback = (newValue: object) => setValue(newValue)
            objectStore?.subscribe(id, callback)
            return () => objectStore?.unsubscribe(id, callback)
        }
    }, [objectStore, ignoreUpdates, id])

    return [value, callbacks]
}
