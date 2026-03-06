---
title: React Integration
sidebar:
    order: 2
---

SynState provides a companion package `synstate-react-hooks` for seamless React integration.

## Installation

```bash
npm add synstate-react-hooks
```

## Basic Usage

`createState` from `synstate-react-hooks` returns a React hook instead of a raw Observable:

```tsx
import type * as React from 'react';
import { createState } from 'synstate-react-hooks';

const [useUserState, setUserState] = createState({
    name: '',
    email: '',
});

const UserProfile = (): React.JSX.Element => {
    const user = useUserState();

    return (
        <div>
            <p>
                {'Name: '}
                {user.name}
            </p>
            <button
                onClick={() => {
                    setUserState({
                        name: 'Alice',
                        email: 'alice@example.com',
                    });
                }}
            >
                {'Set User'}
            </button>
        </div>
    );
};
```

This is equivalent to the following code without `synstate-react-hooks`:

```tsx
import * as React from 'react';
import { createState } from 'synstate';

const [userState, setUserState] = createState({
    name: '',
    email: '',
});

const UserProfile = (): React.JSX.Element => {
    const user = React.useSyncExternalStore(
        (onStoreChange: () => void) => {
            const { unsubscribe } = userState.subscribe(onStoreChange);

            return unsubscribe;
        },
        () => userState.getSnapshot().value,
    );

    return (
        <div>
            <p>
                {'Name: '}
                {user.name}
            </p>
            <button
                onClick={() => {
                    setUserState({
                        name: 'Alice',
                        email: 'alice@example.com',
                    });
                }}
            >
                {'Set User'}
            </button>
        </div>
    );
};
```

## React v17 or Earlier

If you're using React v17 or earlier (without `useSyncExternalStore`), you can use the core `synstate` package directly with `useState` and `useEffect`:

```tsx
import * as React from 'react';
import { createState } from 'synstate';

// Global state (outside component)
const [userState, setUserState, { getSnapshot }] = createState({
    name: '',
    email: '',
});

const UserProfile = (): React.JSX.Element => {
    const [user, setUser] = React.useState(getSnapshot());

    React.useEffect(() => {
        const subscription = userState.subscribe(setUser);

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <div>
            <p>
                {'Name: '}
                {user.name}
            </p>
            <button
                onClick={() => {
                    setUserState({
                        name: 'Alice',
                        email: 'alice@example.com',
                    });
                }}
            >
                {'Set User'}
            </button>
        </div>
    );
};
```
