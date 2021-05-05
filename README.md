# DataStore App Service

> **WARNING**: THIS SERVICE IS STILL A WORK-IN-PROGRESS, THE API WILL PROBABLY CHANGE!

This DataStore app service support persistent user and global application settings as well as saved (and sharable) objects, such as visualization configurations.

This library was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).

## Installation

```sh
yarn add @dhis2/app-service-datastore
```

## Features

- Save and load application settings from a well-known dataStore (or userDataStore) key
- Create, read, update, and delete saved objects (i.e. `visualizations`) from a managed key-value store in the dataStore or userDataStore
- Client-side syncronized state - automatically re-render all components which use a setting or object when that setting or object is updated somewhere else in the application (no refetch required)
- Optimistic updates - propagate "provisional" data to all consumers while mutation is in-transit, roll back changes if the mutation fails
- Optionally encrypt settings data at rest

## API

### DataStoreProvider props

| **Name**              | **Type**          | **Required** | **Default** | **Description**                                                                  |
| --------------------- | ----------------- | ------------ | ----------- | -------------------------------------------------------------------------------- |
| namespace             | _Boolean_         | **REQUIRED** |             | The namespace to use                                                             |
| loadingComponent      | _React Component_ |              | null        | A component to render during initial load                                        |
| defaultGlobalSettings | _Object_          |              | {}          | Default settings to save in the dataStore                                        |
| defaultUserSettings   | _Object_          |              | {}          | Default settings to save in the userDataStore                                    |
| encryptSettings       | _boolean_         |              | false       | If true, encrypt all settings at rest (important if credentials could be stored) |

### Hooks

This library provides four main hooks:

```ts
type useSetting = (
  id: string,
  options?: HookOptions
) => [value: any, { set: (newValue: any) => Promise<void> }];

type useAllSettings = (
  options?: HookOptions
) => [
  settings: Record<string, any>,
  { set: (key: string, value: any) => Promise<void> }
];

type useSavedObject = (
  id: string,
  options?: HookOptions
) => [
  obj: object,
  {
    update: (obj: object) => Promise<object>;
    replace: (obj: object) => Promise<void>;
    remove: () => Promise<void>;
  }
];

type useSavedObjectList = (
  options?: HookOptions
) => [
  list: object[],
  {
    add: (obj: object) => Promise<void>;
    update: (id: string, obj: object) => Promise<object>;
    replace: (id: string, obj: object) => Promise<void>;
    remove: (id: string) => Promise<void>;
  }
];
```

Each of the hooks accepts an optional options object:

```ts
type HookOptions = {
  // If true, store this setting or object in the dataStore instead of userDataStore
  global: boolean;

  // If true, do NOT rerender this component when the value is changed somewhere else in the application
  ignoreUpdates: boolean;
};
```

There is one additional hook which exposes the DataStore controller for imperative access (advanced):

```ts
type useDataStore = () => DataStore;
```

## Usage

### Wrap the application in a DataStore provider

```jsx
import React from "react";
import { DataStoreProvider } from "@dhis2/app-service-datastore";
import AppRouter from "./AppRouter";

const App = () => (
  <DataStoreProvider namespace="myAppName">
    <AppRouter />
  </DataStoreProvider>
);

export default App;
```

### Reading settings

```jsx
import React from "react";
import { useSetting, useAllSettings } from "@dhis2/app-service-datastore";

const MyComponent = () => {
  // All data-store settings for the current user
  const [allUserSettings] = useAllSettings();
  // All data-store settings within the namespace
  const [allGlobalSettings] = useAllSettings({ global: true });
  // A specific setting for the current user
  const [aUserSetting] = useSetting("id-1");
  // A specific global setting
  const [aGlobalSetting] = useSetting("id-1", { global: true });

  return "Something";
};

export default MyComponent;
```

### Reading saved objects

```jsx
import React from "react";
import {
  useSavedObject,
  useSavedObjectList,
} from "@dhis2/app-service-datastore";

const MyComponent = () => {
  // All saved objects for the current user
  const [allUserSavedObjects] = useSavedObjectList();
  // All saved objects within the namespace
  const [allGlobalSavedObjects] = useSavedObjectList({ global: true });
  // A specific saved object for the current user
  const [aUserSavedObject] = useSavedObject("id-1");
  // A specific global saved object
  const [aGlobalSavedObject] = useSavedObject("id-1", { global: true });

  return "Something";
};

export default MyComponent;
```

### Mutating settings and saved objects

```jsx
import React from "react";
import {
  useSavedObject,
  useSavedObjectList,
  useSetting,
  useAllSettings,
} from "@dhis2/app-service-datastore";

const MyComponent = () => {
  // A setting for the current user
  const [userSetting, { set }] = useSetting("id-1");

  // All settings for the current user
  const [userSettings, { set }] = useAllSettings();

  // A saved object for the current user
  const [savedObject, { update, replace, remove }] = useSavedObject("id-1");

  // All saved objects for the current user
  const [
    allUserSavedObjects,
    { add, update, replace, remove },
  ] = useSavedObjectList();

  return "Something";
};
```

## Report an issue

The issue tracker can be found in [DHIS2 JIRA](https://jira.dhis2.org)
under the [LIBS](https://jira.dhis2.org/projects/LIBS) project.

Deep links:

- [Bug](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10006&components=11027)
- [Feature](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10300&components=11027)
- [Task](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10003&components=11027)
