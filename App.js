import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { ImagePicker, Permissions } from "expo";

export default class App extends React.Component {
  state = {
    image: null,
    permissionCameraRoll: null,
    permissionCamera: null
  }

  componentDidMount() {
    this.registerForCameraAsync();
  }

  render() {
    const { image, permissionCameraRoll, permissionCamera } = this.state;

    return (
      <View style={styles.container}>
        <Button
          title="Pick an image from camera roll"
          onPress={this.handlePickImageAsync}
        />
        <Button
          title="Open Camera"
          onPress={this.handleOpenCameraAsync}
        />
        {
          image && <Image source={{uri: image}} style={{ width: 200, height: 200 }} />
        }
        { permissionCamera && <Text>{permissionCamera}</Text> }
        { permissionCameraRoll && <Text>{permissionCameraRoll}</Text> }
      </View>
    );
  }

  registerForCameraAsync = async () => {
    // permission camera roll
    const { status: existingStatusCameraRoll } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    let finalStatusCameraRoll = existingStatusCameraRoll;

    // permission camera
    const { status: existingStatusCamera } = await Permissions.getAsync(Permissions.CAMERA);
    let finalStatusCamera = existingStatusCamera;

    if (existingStatusCamera !== 'granted') {
      this.setState({permissionCamera: 'Missing Camera Permission'})

      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      finalStatusCamera = status;
    }

    if (existingStatusCameraRoll !== 'granted') {
      this.setState({permissionCameraRoll: 'Missing Camera Roll Permission'})

      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      finalStatusCameraRoll = status;
    }

    if (finalStatusCameraRoll !== 'granted' || finalStatusCamera !== 'granted') {
      return;
    }
  }

  handlePickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log('CAMERA_ROLL ', result);

    if (!result.cancelled) {
      this.setState({image: result.uri});
    }
  }

  handleOpenCameraAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    console.log('CAMERA ', result);

    if (!result.cancelled) {
      this.setState({image: result.uri});
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
