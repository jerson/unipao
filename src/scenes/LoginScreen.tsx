import * as React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
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

export interface LoginScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  isLoading: boolean;
  failedLogin: boolean;
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
    isLoading: false,
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

  login = async () => {
    let username = this.refs.username.getValue();
    let password = this.refs.password.getValue();
    let captcha = this.refs.captcha.getValue();
    let remember = this.refs.remember.getValue();

    if (!username || !captcha) {
      this.context.notification.show({
        type: 'warning',
        title: _('Ingresa tus datos y el código de imágen'),
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
      let valid = await UPAO.login(username, password, captcha);
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

    this.setState({ isLoading: false, failedLogin: !success });
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
    let { isLoading, loadedCredentials, failedLogin, defaults } = this.state;
    const captchaHTML = `
    <html>
    <style>body,html{padding:0;margin:0;background: transparent !important;overflow:hidden} img{border-radius: 4px;width:100px;heigh:50px}</style>
    <body>
    <img src="https://campusvirtual.upao.edu.pe/captcha.ashx"/>
    </body>
    </html>
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
              {isLoading && (
                <AlertMessage
                  type={'info'}
                  isLoading={true}
                  message={_('Iniciando sesión, demorará varios segundos...')}
                />
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
                  onSubmitEditing={() => this.refs.captcha.focus()}
                  // onSubmitEditing={this.login}
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
              <View style={{ flexDirection: 'row' }}>
                {isLoading && (
                  <View
                    style={[
                      {
                        width: 100,
                        height: 35,
                        marginTop: 5,
                        backgroundColor: 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }
                    ]}
                  >
                    <Loading />
                  </View>
                )}
                {!isLoading && (
                  <WebViewDownloader
                    style={[
                      {
                        width: 100,
                        height: 50,
                        marginTop: 5,
                        backgroundColor: 'transparent'
                      }
                    ]}
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
                )}
                <Input
                  style={styles.inputCaptcha}
                  ref={'captcha'}
                  placeholder={_('Código de imágen')}
                  returnKeyType={'go'}
                  blurOnSubmit={true}
                  onSubmitEditing={this.login}
                />
              </View>
            </View>
          )}

          {loadedCredentials && (
            <Button
              isLoading={isLoading}
              type={'primary'}
              onPress={this.login}
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
  inputCaptcha: {
    // flex:1,
    width: 190
    // padding: 10,
    // fontSize: 15
  },
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
