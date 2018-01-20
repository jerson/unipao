import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import CustomWebView from 'react-native-custom-android-webview';

const TAG = 'WebViewDownloaderAndroid';
export default class WebViewDownloaderAndroid extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  render() {
    let { onNavigationStateChange, ...props } = this.props;

    return (
      <CustomWebView
        style={[styles.container]}
        javaScriptEnabled
        domStorageEnabled
        javaScriptEnabledAndroid
        scalesPageToFit={false}
        onNavigationStateChange={onNavigationStateChange}
        {...props}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
