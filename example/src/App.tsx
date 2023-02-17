import {
  Button,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';
import {getUpdateManager, registerUpdateManager} from '@herina-rn/client';
import React, {useEffect, Suspense, lazy} from 'react';

const LazyComponent = lazy(() => import('./dynamic-import'));

const App = () => {
  const onUpdate = async () => {
    const manager = getUpdateManager();

    if (manager.checkForUpdate()) {
      Alert.alert('No available update.');
      return;
    }

    await manager.requestUpdate();

    manager.applyUpdate(true);
  };

  const onReloadApp = () => {
    const manager = getUpdateManager();

    manager.reloadApp();
  };

  const onCallDynamic = async () => {
    const {dynamicFunction} = await import('./dynamic');

    await import('./dynamic1');
    await import('./dynamic2');
    await import('./dynamic3');

    dynamicFunction();
  };

  useEffect(() => {
    registerUpdateManager('https://herina.im');
  }, []);

  return (
    <SafeAreaView>
      <Pressable>
        <Text style={{fontSize: 60, fontWeight: 'bold'}}>Hello World.</Text>
      </Pressable>

      <Image
        style={{width: 100, height: 100}}
        source={require('./assets/image/logo.png')}
      />

      <Button title="Update App" onPress={onUpdate} />
      <Button title="reloadApp" onPress={onReloadApp} />
      <Button title="Call Dynamic Module" onPress={onCallDynamic} />

      <Suspense>
        <LazyComponent />
      </Suspense>
    </SafeAreaView>
  );
};

export default App;
