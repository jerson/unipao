import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Input from '../components/ui/Input';
import { Theme } from '../themes/styles';
import PropTypes from 'prop-types';
import Request from '../modules/network/Request';
import Log from '../modules/logger/Log';
import Emitter from '../modules/listener/Emitter';
import KeyboardSpacer from '../components/ui/KeyboardSpacer';
import Background from '../components/ui/Background';
import Config from '../../Config';
import Auth from '../modules/session/Auth';
import RouterUtil from '../modules/util/RouterUtil';
import ViewSpacer from '../components/ui/ViewSpacer';
import InputSwitch from '../components/ui/InputSwitch';
import SingleStorage from '../modules/storage/SingleStorage';
import Loading from '../components/ui/Loading';
import { _ } from '../modules/i18n/Translator';

const TAG = 'LoginScreen';
export default class LoginScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = {
    title: Config.app.name,
    headerBackTitle: null,
    headerTitleStyle: Theme.title,
    headerTintColor: Theme.tintColor,
    headerStyle: [Theme.navigationBar]
  };

  state = {
    isLoading: false,
    loadedCredentials: false,
    defaults: {}
  };

  login = async () => {
    let username = this.refs.username.getValue();
    let password = this.refs.password.getValue();
    let remember = this.refs.remember.getValue();

    this.setState({ isLoading: true });

    let success = false;

    try {
      let response = await Request.post('ge/se/valida', {
        emei: '000000000000000',
        fcm: 'none',
        id: username,
        clave: password
      });

      let { body } = response;
      if (body.data) {
        let data = JSON.parse(body.data);
        success = await Auth.login(data[0]);
        if (success) {
          if (remember) {
            SingleStorage.set('username', username);
            SingleStorage.set('password', password);
            SingleStorage.set('remember', '1');
          } else {
            SingleStorage.remove('username');
            SingleStorage.remove('password');
            SingleStorage.remove('remember');
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
        title: _('Usuario y/o contraseña incorrectos'),
        icon: 'error-outline',
        autoDismiss: 4,
        iconType: 'MaterialIcons'
      });
    }

    this.setState({ isLoading: false });
  };

  onSuccessLogin = () => {
    RouterUtil.resetTo(this.props.navigation, 'User');
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

  async componentDidMount() {
    Emitter.on('onSuccessLogin', this.onSuccessLogin);
    Dimensions.addEventListener('change', this.onDimensionsChange);

    await this.loadDefaultCredentials();
  }

  componentWillUnmount() {
    Emitter.off(this.onSuccessLogin);
    Dimensions.removeEventListener('change', this.onDimensionsChange);
  }

  render() {
    let { height } = Dimensions.get('window');
    let { isLoading, loadedCredentials, defaults } = this.state;
    return (
      <ScrollView
        contentContainerStyle={[styles.content, { minHeight: height }]}
        style={[styles.container]}
        keyboardShouldPersistTaps={'handled'}
      >
        <Background />
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
            <View style={[styles.inputsContainer, Theme.shadowLarge]}>
              <Input
                containerStyle={styles.inputFirst}
                style={styles.input}
                ref={'username'}
                placeholder={_('Código de alumno')}
                defaultValue={defaults.username}
                returnKeyType={'next'}
                keyboardType={'email-address'}
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
                returnKeyType={'go'}
                blurOnSubmit={true}
                onSubmitEditing={this.login}
              />
            </View>
            <ViewSpacer size={'medium'} />
            <InputSwitch
              useLabel
              center
              defaultValue={!!defaults.remember}
              ref={'remember'}
              placeholder={_('Recordar mis credenciales')}
            />
          </View>
        )}

        <Button
          isLoading={isLoading}
          type={'primary'}
          onPress={this.login}
          label={_('Iniciar sesión')}
          icon={'user'}
          iconType={'FontAwesome'}
        />

        <ViewSpacer size={'large'} />
        <Button
          type={'link'}
          onPress={() => {
            this.props.navigation.navigate('About');
          }}
          label={_('Acerca del desarrollador')}
        />

        <KeyboardSpacer />
      </ScrollView>
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
  formContainer: {
    marginTop: 20,
    marginBottom: 10,
    width: 300,
    alignSelf: 'center'
  },
  inputsContainer: {
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
