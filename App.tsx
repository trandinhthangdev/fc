import React from 'react';
import {Provider} from 'react-redux';
import store from './src/redux/store';

import TrackPlayer from 'react-native-track-player';
import playbackService from './service';

import Wrapper from './Wrapper';

TrackPlayer.registerPlaybackService(() => playbackService);

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <Wrapper />
    </Provider>
  );
}

export default App;
