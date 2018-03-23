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
      message: _('Abriendo enlace en tu navegador'),
      isLoading: true,
      autoDismiss: 4
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
      /*setTimeout(function(){
        var imgCaptcha = document.getElementById( "imgCaptcha" ) || {};
        var originalSrc ='/captcha.ashx';    
        imgCaptcha.src = 'error.jpg';
        setTimeout(function(){
              imgCaptcha.src = originalSrc;
        },1000 * 1);
      },1000 );*/

try{
    if (window.location.href.indexOf('upao.edu.pe/login.aspx')!==-1){   
     

       
      var style = document.createElement( "style" );
      style.innerHTML = 'table, td, tr, div {' +
      '    width: auto !important;' +
      '    text-align: center !important;' +
      '    margin: 0 auto !important;' +
      '    background: none !important;' +
      '    font-family: Roboto,Helvetica,Arial; !important;' +
      '} ' +
      '#e_pie,.e_cab,map,div[style*=Orange], div[style*=orange] {' +
      '    display: none !important' +
      '} ' +
      'body{' +
      '    display: flex !important;' +
      '    align-items: center !important;' +
      '    justify-content: center !important;' +
      '    flex: 1 !important;' +
      '    height: 100vh !important;' +
      '    min-height: 100px !important;' +
      '    background: #fff !important;' +
      '}' +
      'input[type=text], input[type=password] {' +
      '    background: #fff !important;' +
      '    padding: 4px !important;' +
      '    border: 1px solid #d4d4d4 !important;' +
      '    border-radius: 4px !important;' +
      '    padding-left: 10px !important;' +
      '    font-size: 16px !important;' +
      '    font-weight: normal !important;' +
      '    max-width: 280px;' +
      '    -webkit-box-shadow: 0 0 10px rgba(0,0,0,0.08) !important;' +
      '    box-shadow: 0 0 10px rgba(0,0,0,0.08) !important;' +
      '    font-family: Roboto,Helvetica,Arial; !important;' +
      '} '+
      'img {' +
      '  width: 100% !important;' +
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
        dataDetectorTypes={'none'}
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
