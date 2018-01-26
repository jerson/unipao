import * as React from 'react';
import {
  Clipboard,
  Linking,
  NavState,
  Platform,
  StyleSheet,
  WebView,
  WebViewProperties
} from 'react-native';
import Log from '../../modules/logger/Log';
import { _ } from '../../modules/i18n/Translator';
import * as PropTypes from 'prop-types';

export interface WebViewDownloaderProps extends WebViewProperties {
  injectedJavaScript?: string;
  onNavigationStateChange?: (event: NavState) => void;
}

export interface State {}

const TAG = 'WebViewDownloader';
export default class WebViewDownloader extends React.Component<
  WebViewDownloaderProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };
  onNavigationStateChange = (navState: NavState) => {
    let url = navState.url || '';
    if (url.indexOf('http') !== 0) {
      return;
    }
    let lastPart = url.substr(url.lastIndexOf('.') + 1);

    Log.warn(TAG, 'onNavigationStateChange', url);

    let { onNavigationStateChange } = this.props;
    if (typeof onNavigationStateChange === 'function') {
      onNavigationStateChange(navState);
    }

    if (url.indexOf('adjunto.aspx?cod=') !== -1) {
      this.openRemoteLink(url);
      return;
    }

    switch (lastPart) {
      case 'ipa':
      case 'apk':
      case 'plist':
      case 'zip':
      case 'rar':
      case 'doc':
      case 'docx':
      case 'ppt':
      case 'pptx':
      case 'xls':
      case 'xlsx':
      case 'pdf':
      case '7zip':
        this.openRemoteLink(url);
        break;
    }
  };

  openRemoteLink(url: string) {
    this.context.notification.show({
      type: 'warning',
      id: 'browser',
      message: _('Abriendo url externa'),
      icon: 'file-download',
      autoDismiss: 4,
      iconType: 'MaterialIcons'
    });
    setTimeout(() => {
      this.openExternalLink(url);
    }, 2000);
  }

  async openExternalLink(url: string) {
    try {
      let supported = await Linking.canOpenURL(url);

      if (!supported) {
        Clipboard.setString(url);
        this.context.notification &&
          this.context.notification.show({
            id: 'browser',
            title: _('Error al abrir url'),
            message: _(
              'Para continuar, Pega el enlace que ya esta en tu portapapeles a tu navegador'
            ),
            icon: 'file-download',
            level: 'warning',
            autoDismiss: 5
          });
        return;
      }
      return Linking.openURL(url);
    } catch (e) {
      Log.error('An error occurred', e);
    }
  }

  render() {
    let { injectedJavaScript, onNavigationStateChange, ...props } = this.props;

    const script = `


try{
    if (window.location.href.indexOf('upao.edu.pe/login.aspx')!==-1){    
      var style = document.createElement( "style" );
      style.innerHTML = 'table, td, tr, div {' +
      '    width: auto !important;\\n' +
      '    text-align: center !important;\\n' +
      '    margin: 0 auto !important;\\n' +
      '    background: none !important;\\n' +
      '    font-family: Roboto,Helvetica,Arial; !important;\\n' +
      '} ' +
      '#e_pie,.e_cab,map,div[style*=Orange], div[style*=orange] {' +
      '    display: none !important\\n' +
      '} ' +
      'body{' +
      '    display: flex !important;\\n' +
      '    align-items: center !important;\\n' +
      '    justify-content: center !important;\\n' +
      '    flex: 1 !important;\\n' +
      '    height: 100vh !important;\\n' +
      '    min-height: 100px !important;\\n' +
      '    background: #fff !important;\\n' +
      '}' +
      'input[type=text], input[type=password] {' +
      '    background: #fff !important;\\n' +
      '    padding: 4px !important;\\n' +
      '    border: 1px solid #d4d4d4 !important;\\n' +
      '    border-radius: 4px !important;\\n' +
      '    padding-left: 10px !important;\\n' +
      '    font-size: 16px !important;\\n' +
      '    font-weight: normal !important;\\n' +
      '    max-width: 280px;\\n' +
      '    -webkit-box-shadow: 0 0 10px rgba(0,0,0,0.08) !important;\\n' +
      '    box-shadow: 0 0 10px rgba(0,0,0,0.08) !important;\\n' +
      '    font-family: Roboto,Helvetica,Arial; !important;\\n' +
      '} '+
      'img {' +
      '  width: 100% !important;\\n' +
      '}';
      document.getElementsByTagName( "head" )[0].appendChild( style );
      
      
      var element = document.getElementsByTagName("iframe"), index;
      for (index = element.length - 1; index >= 0; index--) {
         element[index].parentNode.parentNode.removeChild(element[index].parentNode); 
      }
      
      
      var element3 = document.getElementsByTagName("a"), index3;
      for (index3 = element3.length - 1; index3 >= 0; index3--) {
        element3[index3].parentNode.removeChild(element3[index3]);
      }
      
    }
    
    var hash = Math.random();
    var link = document.createElement( "link" );
    link.href = "https://unipao.com/app.css?"+hash;
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "screen,print";
    document.getElementsByTagName( "head" )[0].appendChild( link );
    
}catch(e){
}



`;

    const scriptIOS = `
   
    if (window.location.href.indexOf('upao.edu.pe/login.aspx')!==-1){   
      var metaTag=document.createElement('meta');
      metaTag.name = "viewport"
      metaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      document.getElementsByTagName('head')[0].appendChild(metaTag);
    }
    `;

    return (
      <WebView
        style={[styles.container]}
        injectedJavaScript={
          script +
          (Platform.OS === 'ios' ? scriptIOS : '') +
          (injectedJavaScript || '')
        }
        javaScriptEnabled
        domStorageEnabled
        scalesPageToFit={false}
        scrollEnabled={true}
        onNavigationStateChange={this.onNavigationStateChange}
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