import * as React from 'react';
import { NavState, StyleSheet, WebViewProperties } from 'react-native';
import * as PropTypes from 'prop-types';
import CustomWebView from 'react-native-custom-android-webview';

export interface WebViewDownloaderProps extends WebViewProperties {
  injectedJavaScript?: string;
  onNavigationStateChange?: (event: NavState) => void;
}

export interface State {}

const TAG = 'WebViewDownloaderAndroid';
export default class WebViewDownloaderAndroid extends React.Component<
  WebViewDownloaderProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
  };

  render() {
    const { onNavigationStateChange, ...props } = this.props;

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
    flex: 1,
  },
});
