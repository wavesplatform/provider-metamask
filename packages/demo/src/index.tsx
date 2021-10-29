import * as React from 'react';
import { render } from 'react-dom';
import { Provider as MobxProvider } from 'mobx-react';

import { RootStore } from '@stores';
import { App } from '@components';

const rootStore = new RootStore();

render(<MobxProvider {...rootStore}><App/></MobxProvider>, document.getElementById('root'));
