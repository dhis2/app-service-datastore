import React, { useEffect, useState, useMemo } from 'react'
import { DataStoreContext } from './DataStoreContext'
import { useDataEngine } from '@dhis2/app-runtime'
import { DataStore } from './stores/DataStore'

interface DataStoreProviderInput {
    namespace: string
    children: React.ReactNode
    loadingComponent: React.ReactNode
    defaultGlobalSettings?: Record<string, any>
    defaultUserSettings?: Record<string, any>
}

export const DataStoreProvider = ({
    namespace,
    defaultGlobalSettings,
    defaultUserSettings,
    children,
    loadingComponent = null,
}: DataStoreProviderInput) => {
    const [loading, setLoading] = useState(true)
    const engine = useDataEngine()
    const store = useMemo(
        () =>
            new DataStore({
                engine,
                namespace,
                defaultGlobalSettings,
                defaultUserSettings,
            }),
        [] /* eslint-disable-line react-hooks/exhaustive-deps */
    )

    useEffect(() => {
        let cancelled = false
        const init = async () => {
            await store.initialize()
            if (!cancelled) {
                setLoading(false)
            }
        }
        init()
        return () => {
            cancelled = true
        }
    }, [store])

    return (
        <DataStoreContext.Provider value={store}>
            {loading ? loadingComponent : children}
        </DataStoreContext.Provider>
    )
}
