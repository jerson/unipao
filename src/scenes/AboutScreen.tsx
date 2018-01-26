import * as React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { Theme } from '../themes/styles';
import * as PropTypes from 'prop-types';
import KeyboardSpacer from '../components/ui/KeyboardSpacer';
import Background from '../components/ui/Background';
import ViewSpacer from '../components/ui/ViewSpacer';
import { _ } from '../modules/i18n/Translator';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions
} from 'react-navigation';

export interface AboutScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {}

const TAG = 'AboutScreen';
export default class AboutScreen extends React.Component<
  AboutScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions: NavigationStackScreenOptions = {
    title: _('Acerca de'),
    headerBackTitle: null,
    headerTitleStyle: Theme.title,
    headerTintColor: Theme.tintColor,
    headerStyle: [Theme.navigationBar]
  };

  state: State = {};

  onDimensionsChange = () => {
    this.forceUpdate();
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
        contentContainerStyle={[styles.content, { minHeight }]}
        style={[styles.container]}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps={'handled'}
      >
        <Background />
        <Icon name={'help-with-circle'} style={styles.icon} type={'Entypo'} />

        <View style={[styles.formContainer]}>
          <Text style={styles.text}>
            {_(
              'Somos ex-alumnos de la carrera de ingeniería de software, espero que esta aplicación te sea de utilidad.'
            )}
          </Text>

          <ViewSpacer />

          <Text style={[styles.text, styles.sectionTitle]}>
            {_('Importante')}:
          </Text>
          <Text style={styles.text}>
            {_(
              'Esta aplicación es un proyecto que se hizo con el único fin de aprendizaje, no tiene ningún vinculo oficial con la UPAO.'
            )}
          </Text>
          <Text style={styles.text}>
            {_(
              'Para garantizar su seguridad todos los datos que se envian se hace unicamente entre tú dispositivo y la UPAO, ningún dato se almacena en otro servidor externo.'
            )}
          </Text>

          <ViewSpacer />

          <Text style={[styles.text, styles.sectionTitle]}>Github:</Text>
          <Text style={styles.text}>@jerson</Text>
          <Text style={styles.text}>@wilsonvargas</Text>
        </View>

        <ViewSpacer />

        <Button
          type={'link'}
          onPress={() => {
            this.props.navigation.goBack();
          }}
          label={_('Volver al inicio de sesión')}
          icon={'ios-arrow-back'}
          iconType={'Ionicons'}
        />
        <KeyboardSpacer />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  content: {
    paddingTop: 30,
    paddingBottom: 10,
    justifyContent: 'center'
  },
  icon: {
    fontSize: 60,
    alignSelf: 'center',
    color: '#fff',
    backgroundColor: 'transparent'
  },
  sectionTitle: {
    fontWeight: 'bold'
  },
  text: {
    color: '#fff',
    backgroundColor: 'transparent',
    padding: 5
  },
  formContainer: {
    marginTop: 10,
    marginBottom: 10,
    width: 300,
    alignSelf: 'center'
  }
});
