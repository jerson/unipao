import * as React from 'react';
import {
  Dimensions,
  Image,
  NativeEventEmitter,
  ScrollView,
  StyleSheet,
  View,
  WebView,
  WebViewMessageEventData
} from 'react-native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Theme } from '../themes/styles';
import * as PropTypes from 'prop-types';
import Log from '../modules/logger/Log';
import Emitter from '../modules/listener/Emitter';
import KeyboardSpacer from '../components/ui/KeyboardSpacer';
import Background from '../components/ui/Background';
import Config from '../Config';
import Auth from '../modules/session/Auth';
import RouterUtil from '../modules/util/RouterUtil';
import ViewSpacer from '../components/ui/ViewSpacer';
import InputSwitch from '../components/ui/InputSwitch';
import SingleStorage from '../modules/storage/SingleStorage';
import Loading from '../components/ui/Loading';
import { _ } from '../modules/i18n/Translator';
import UPAO from '../scraping/UPAO';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions
} from 'react-navigation';
import AlertMessage from '../components/ui/AlertMessage';
import WebViewDownloader from '../components/ui/WebViewDownloader';
import { Params } from '../scraping/utils/ParamsUtils';

export interface LoginScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  isLoading: boolean;
  isLoadingCaptcha: boolean;
  failedLogin: boolean;
  prepared: boolean;
  params?: Params;
  loadedCredentials: boolean;
  defaults: {
    username?: string;
    password?: string;
    remember?: string;
  };
}

const TAG = 'LoginScreen';
export default class LoginScreen extends React.Component<
  LoginScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions: NavigationStackScreenOptions = {
    title: Config.app.name,
    headerBackTitle: null,
    headerTitleStyle: Theme.title,
    headerTintColor: Theme.tintColor,
    headerStyle: [Theme.navigationBar]
  };

  state: State = {
    failedLogin: false,
    isLoadingCaptcha: false,
    isLoading: false,
    prepared: false,
    params: undefined,
    loadedCredentials: false,
    defaults: {}
  };
  refs: {
    username: Input;
    password: Input;
    captcha: Input;
    remember: Input;
  };

  clearCredentials = () => {
    SingleStorage.remove('username');
    SingleStorage.remove('password');
    SingleStorage.remove('remember');
  };
  onRememberChange = (remember: boolean) => {
    !remember && this.clearCredentials();
  };

  loginPrepare = async () => {
    let username = this.refs.username.getValue();

    if (!username) {
      this.context.notification.show({
        type: 'warning',
        title: _('Ingresa tus datos'),
        icon: 'error-outline',
        id: 'login',
        autoDismiss: 2,
        iconType: 'MaterialIcons'
      });
      return;
    }

    this.setState({
      isLoading: true,
      isLoadingCaptcha: false,
      prepared: false,
      params: undefined
    });

    let prepared = false;
    let params = undefined;
    let isLoadingCaptcha = false;

    try {
      params = await UPAO.loginPrepare(username);
      if (params) {
        prepared = true;
        isLoadingCaptcha = true;
      }
    } catch (e) {
      Log.warn(TAG, 'login', e);
    }

    if (!prepared) {
      this.context.notification.show({
        type: 'warning',
        title: _(
          'Error al intentar iniciar sesión, lo arreglaremos en unos minutos'
        ),
        icon: 'error-outline',
        id: 'login',
        autoDismiss: 8,
        iconType: 'MaterialIcons'
      });
    }
    this.setState(
      { isLoading: false, isLoadingCaptcha, prepared, params },
      () => {
        if (this.state.prepared) {
          // if dont have catpcha must direct call this
          // this.loginSend();
          setTimeout(() => {
            this.refs.captcha && this.refs.captcha.focus();
          }, 100);
        }
      }
    );
  };

  loginSend = async () => {
    let username = this.refs.username.getValue();
    let password = this.refs.password.getValue();
    let captcha = this.refs.captcha.getValue();
    let remember = this.refs.remember.getValue();
    let { params } = this.state;

    if (!captcha) {
      this.context.notification.show({
        type: 'warning',
        title: _('Ingresa el código de imágen'),
        icon: 'error-outline',
        id: 'login',
        autoDismiss: 2,
        iconType: 'MaterialIcons'
      });
      return;
    }

    this.setState({ isLoading: true });

    let success = false;

    try {
      let valid = await UPAO.loginSend(
        params || {},
        username,
        password,
        captcha
      );
      if (valid) {
        success = await Auth.login();
        if (success) {
          if (remember) {
            SingleStorage.set('username', username);
            SingleStorage.set('password', password);
            SingleStorage.set('remember', '1');
          } else {
            this.clearCredentials();
          }
          RouterUtil.resetTo(this.props.navigation, 'User');
          return;
        }
      }
    } catch (e) {
      Log.warn(TAG, 'login', e);
    }

    if (!success) {
      this.context.notification.show({
        type: 'warning',
        title: _(
          'Usuario y/o contraseña incorrectos, si tus datos son correctos probablemente sea un problema del campus, lo arreglaremos en unos minutos'
        ),
        icon: 'error-outline',
        id: 'login',
        autoDismiss: 8,
        iconType: 'MaterialIcons'
      });
    }

    this.setState({ isLoading: false, prepared: false, failedLogin: !success });
  };
  onLoginStatus = (success: boolean) => {
    success && RouterUtil.resetTo(this.props.navigation, 'User');
  };
  onDimensionsChange = () => {
    this.forceUpdate();
  };
  loadDefaultCredentials = async () => {
    let username = await SingleStorage.get('username');
    let password = await SingleStorage.get('password');
    let remember = await SingleStorage.get('remember');
    this.setState({
      loadedCredentials: true,
      defaults: { remember, username, password }
    });
  };
  loginFallback = () => {
    this.props.navigation.navigate('LoginFallback');
  };
  onMessage = async (event: any) => {
    let data = event.nativeEvent.data;
    this.setState({ isLoadingCaptcha: true });
    try {
      let response = await fetch('http://bp.setbeat.com/default', {
        method: 'POST',
        body: data
      });
      let captcha = await response.text();
      Log.warn(TAG, 'onMessage', 'captcha', captcha);
      if (captcha && captcha.indexOf('error') == -1 && this.refs.captcha) {
        this.refs.captcha.setValue(captcha);
      }
    } catch (e) {
      Log.warn(TAG, 'onMessage', e);
    }
    this.setState({ isLoadingCaptcha: false });
  };

  async componentDidMount() {
    Emitter.on('onLoginStatus', this.onLoginStatus);
    Dimensions.addEventListener('change', this.onDimensionsChange);

    await this.loadDefaultCredentials();
  }

  componentWillUnmount() {
    Emitter.off(this.onLoginStatus);
    Dimensions.removeEventListener('change', this.onDimensionsChange);
    UPAO.abort('login');
  }

  render() {
    let { height } = Dimensions.get('window');
    let {
      isLoading,
      isLoadingCaptcha,
      loadedCredentials,
      prepared,
      failedLogin,
      defaults
    } = this.state;
    const captchaHTML = `
    <html>
    <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <style>body,html{padding:0;margin:0;background: transparent !important;overflow:hidden} img{border-radius: 4px;width:100px;heigh:50px}</style>
    <body>
    <img id="captcha" src="https://campusvirtual.upao.edu.pe/captcha.ashx"/>
    </body>
    </html>
`;

    const scripts = `
    var sended = false;
     var checker = setInterval(function() {
         if(sended) { 
             clearInterval(checker);
             return
          }
          if(!window.postMessage){
          return
          } 
              var img = document.getElementById('captcha');
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                context.drawImage(img, 0, 0, 300, 150);
                
                var resizedCanvas = document.createElement("canvas");
                var resizedContext = resizedCanvas.getContext("2d");
                
                resizedCanvas.height = "30";
                resizedCanvas.width = "80";
                                
                resizedContext.drawImage(canvas, 0, 0, 80, 30);
                var dataURL = resizedCanvas.toDataURL();
                
                var imageEncoded = dataURL.replace('data:image/png;base64,', '');
                 
                if(imageEncoded) { 
                   sended = true;
                  window.postMessage(imageEncoded); 
                 }
          
     },100)
    
    `;
    return (
      <View style={{ flex: 1 }}>
        <Background />
        <ScrollView
          contentContainerStyle={[styles.content, { minHeight: height }]}
          style={[styles.container]}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps={'handled'}
        >
          <View style={[styles.imageContainer, Theme.shadowLarge]}>
            <Image
              style={styles.logo}
              resizeMode={'contain'}
              source={require('../images/icon.png')}
            />
          </View>
          <Image
            style={styles.logoName}
            resizeMode={'contain'}
            source={require('../images/name_alter.png')}
          />

          {!loadedCredentials && <Loading margin />}
          {loadedCredentials && (
            <View style={[styles.formContainer]}>
              {failedLogin && (
                <AlertMessage
                  type={'info'}
                  message={_(
                    'Nota: recuerda que si tienes problemas para iniciar sesión, tenemos un inicio de sesión web que usa el campus oficial.'
                  )}
                />
              )}

              {prepared && (
                <View style={styles.captchaContainer}>
                  <WebView
                    onMessage={this.onMessage}
                    style={styles.captcha}
                    injectedJavaScript={scripts}
                    source={{
                      html: captchaHTML,
                      baseUrl: 'https://campusvirtual.upao.edu.pe/',
                      headers: {
                        Referer:
                          'https://campusvirtual.upao.edu.pe/login.aspx?ReturnUrl=%2fdefault.aspx',
                        'User-Agent':
                          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36'
                      }
                    }}
                  />

                  <Input
                    style={styles.inputCaptcha}
                    ref={'captcha'}
                    placeholder={_('Código de imágen')}
                    returnKeyType={'go'}
                    blurOnSubmit={true}
                    onSubmitEditing={this.loginSend}
                  />
                  {isLoadingCaptcha && (
                    <View style={styles.loadingCaptcha}>
                      <Loading />
                    </View>
                  )}
                </View>
              )}

              <View style={[styles.inputsContainer, Theme.shadowLarge]}>
                <Input
                  containerStyle={styles.inputFirst}
                  style={styles.input}
                  ref={'username'}
                  placeholder={_('Código de alumno ó Usuario')}
                  defaultValue={defaults.username}
                  returnKeyType={'next'}
                  autoCorrect={false}
                  blurOnSubmit={false}
                  onSubmitEditing={() => this.refs.password.focus()}
                />
                <Input
                  secureTextEntry
                  containerStyle={styles.inputLast}
                  style={styles.input}
                  ref={'password'}
                  placeholder={_('Contraseña')}
                  defaultValue={defaults.password}
                  returnKeyType={'next'}
                  blurOnSubmit={false}
                  onSubmitEditing={this.loginPrepare}
                />
              </View>
              <ViewSpacer size={'medium'} />

              <InputSwitch
                useLabel
                center
                onValueChange={this.onRememberChange}
                defaultValue={!!defaults.remember}
                ref={'remember'}
                placeholder={_('Recordar mis credenciales')}
              />
            </View>
          )}

          {loadedCredentials && (
            <Button
              isLoading={isLoading}
              type={'primary'}
              onPress={() => {
                if (prepared) {
                  this.loginSend();
                } else {
                  this.loginPrepare();
                }
              }}
              label={_('Iniciar sesión')}
              icon={'user'}
              iconType={'FontAwesome'}
            />
          )}

          {loadedCredentials && (
            <Button
              type={'info'}
              onPress={this.loginFallback}
              label={_('Iniciar sesión usando la web')}
              icon={'link-external'}
              iconType={'Octicons'}
            />
          )}

          <ViewSpacer size={'large'} />
          <Button
            type={'link'}
            onPress={() => {
              this.props.navigation.navigate('About');
            }}
            label={_('Acerca de')}
          />

          <KeyboardSpacer />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 20,
    paddingBottom: 30,
    justifyContent: 'center'
  },
  container: {},
  logoName: {
    width: 125,
    height: 50,
    alignSelf: 'center'
  },
  imageContainer: {
    backgroundColor: '#f59331',
    width: 100,
    height: 100,
    borderRadius: 24,
    marginBottom: 5,
    alignSelf: 'center'
  },
  logo: {
    width: 100,
    height: 100
  },
  input: {
    padding: 10,
    fontSize: 15
  },
  captchaContainer: {
    flexDirection: 'row'
  },
  captcha: {
    width: 100,
    height: 50,
    marginTop: 5,
    backgroundColor: 'transparent'
  },
  inputCaptcha: {
    // flex:1,
    width: 190
    // padding: 10,
    // fontSize: 15
  },
  loadingCaptcha: { right: 10, top: 15, position: 'absolute' },
  formContainer: {
    marginTop: 20,
    marginBottom: 10,
    width: 300,
    alignSelf: 'center'
  },
  inputsContainer: {
    marginTop: 4,
    borderRadius: 6
  },
  inputFirst: {
    marginBottom: 0,
    marginTop: 0,
    borderBottomWidth: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  inputLast: {
    marginBottom: 0,
    marginTop: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0
  }
});
