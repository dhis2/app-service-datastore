import { createContext } from 'react'
import { DataStore } from './stores/DataStore' /* eslint-disable-line no-unused-vars */

export const DataStoreContext = createContext<DataStore | undefined>(undefined)
