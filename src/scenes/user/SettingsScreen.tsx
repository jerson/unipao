import * as React from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet } from 'react-native';
import PreferenceHeader from '../../components/preference/PreferenceHeader';
import { Color, Theme } from '../../themes/styles';
import PreferenceItem from '../../components/preference/PreferenceItem';
import Button from '../../components/ui/Button';
import Auth from '../../modules/session/Auth';
import RouterUtil from '../../modules/util/RouterUtil';
import PreferenceItemSelect from '../../components/preference/PreferenceItemSelect';
import PreferencesStorage from '../../modules/storage/PreferencesStorage';
import Translator, { _ } from '../../modules/i18n/Translator';
import codePush from 'react-native-code-push';
import * as DeviceInfo from 'react-native-device-info';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions
} from 'react-navigation';
import { InputSelectOption } from '../../components/ui/InputSelect';

export interface SettingsScreenProps {
  navigation: NavigationScreenProp<null, null>;
  screenProps: {
    rootNavigation: NavigationScreenProp<null, null>;
  };
}

export interface State {}

const localeValues: InputSelectOption[] = [
  {
    value: 'auto',
    label: _('Automático')
  },
  {
    value: 'es',
    label: _('Español')
  },
  {
    value: 'en',
    label: _('English')
  },
  {
    value: 'pt',
    label: _('Portuguese')
  }
];
export default class SettingsScreen extends React.Component<
  SettingsScreenProps,
  State
> {
  static navigationOptions: NavigationStackScreenOptions = {
    title: _('Ajustes'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.tintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
    ]
  };

  state = {};
  onDimensionsChange = () => {
    this.forceUpdate();
  };

  logout = () => {
    Alert.alert(_('Cerrar sesión'), _('¿Estas seguro?'), [
      {
        text: _('Cancelar'),
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: _('Cerrar sesión'),
        onPress: async () => {
          await Auth.logout();
          let { screenProps } = this.props;
          RouterUtil.resetTo(screenProps.rootNavigation, 'Login');
        }
      }
    ]);
  };
  onChangeLocale = async (locale: string) => {
    await PreferencesStorage.set('locale', locale);
    Translator.setLocale(locale);
    codePush.restartApp(false);
  };

  componentDidMount() {
    Dimensions.addEventListener('change', this.onDimensionsChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onDimensionsChange);
  }

  render() {
    let minHeight = Dimensions.get('window').height;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[{ minHeight }]}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={true}
      >
        <PreferenceHeader title={_('General')} />

        <PreferenceItemSelect
          name={'locale'}
          values={localeValues}
          title={_('Elegir idioma')}
          onChange={this.onChangeLocale}
          description={_(
            'puedes elegir un idioma o dejar que la aplicación elija uno automaticamente'
          )}
        />

        <PreferenceHeader title={_('Cuenta')} />

        <PreferenceItem
          title={_('Cerrar sesión')}
          description={_('Desconectarme en este dispositivo')}
        >
          <Button
            onPress={this.logout}
            label={_('Salir')}
            type={'primary'}
            icon={'log-out'}
            iconType={'Entypo'}
          />
        </PreferenceItem>

        <PreferenceHeader title={_('Acerca de la aplicación')} />

        <PreferenceItem
          title={_('Desarrolladores')}
          description={'@jerson\n@wilsonvargas'}
        />

        <PreferenceItem
          title={_('Identificador')}
          description={DeviceInfo.getBundleId()}
        />
        <PreferenceItem
          title={_('Versión')}
          description={DeviceInfo.getReadableVersion()}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa'
  }
});
