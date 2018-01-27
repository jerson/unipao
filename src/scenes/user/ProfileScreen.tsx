import * as React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from '../../components/ui/Icon';
import { Theme } from '../../themes/styles';
import * as PropTypes from 'prop-types';
import Background from '../../components/ui/Background';
import Auth from '../../modules/session/Auth';
import Button from '../../components/ui/Button';
import RouterUtil from '../../modules/util/RouterUtil';
import { titleize } from 'underscore.string';
import ImageUtil from '../../modules/util/ImageUtil';
import { _ } from '../../modules/i18n/Translator';
import {
  NavigationScreenProp,
  NavigationTabScreenOptions
} from 'react-navigation';
import ViewSpacer from '../../components/ui/ViewSpacer';

export interface ProfileScreenProps {
  navigation: NavigationScreenProp<null, null>;
  screenProps: {
    rootNavigation: NavigationScreenProp<null, null>;
  };
}

export interface State {}

const TAG = 'ProfileScreen';
export default class ProfileScreen extends React.Component<
  ProfileScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions: NavigationTabScreenOptions = {
    tabBarLabel: _('Perfíl'),
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name={'user'}
        type={'FontAwesome'}
        style={[Theme.tabTarIcon, { color: tintColor || '#444' }]}
      />
    )
  };

  state = {};

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
  onDimensionsChange = () => {
    this.forceUpdate();
  };

  componentDidMount() {
    console.log('hola');
    Dimensions.addEventListener('change', this.onDimensionsChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onDimensionsChange);
  }

  render() {
    let minHeight = Dimensions.get('window').height;
    let user = Auth.getUser();

    return (
      <ScrollView
        contentContainerStyle={[styles.content]}
        style={[styles.container]}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={true}
      >
        {Platform.OS === 'ios' && (
          <StatusBar
            backgroundColor="#0d61ac"
            translucent
            animated
            barStyle="dark-content"
          />
        )}

        {user && (
          <View style={[styles.profile, Theme.shadowLarge]}>
            <View style={[styles.imageContainer, Theme.shadowDefault]}>
              <Image
                style={styles.imagePlaceholder}
                source={require('../../images/placeholder.png')}
              />
              <Image
                style={[styles.image]}
                defaultSource={require('../../images/placeholder.png')}
                source={{ uri: ImageUtil.getUserImage(user) }}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={[styles.name, styles.id]}>{user.id}</Text>
              <Text style={[styles.name]}>{titleize(user.name)}</Text>
            </View>
          </View>
        )}
        <ViewSpacer size={'large'} />

        <Button
          type={'primary'}
          onPress={this.logout}
          label={_('Cerrar sesión')}
          icon={'log-out'}
          iconType={'Entypo'}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4'
  },
  content: {
    paddingBottom: 50,
    justifyContent: 'center'
  },
  profile: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  imagePlaceholder: {
    position: 'absolute',
    left: 0,
    width: 100,
    height: 100,
    borderRadius: 50
  },
  image: {
    backgroundColor: 'transparent',
    width: 100,
    height: 100,
    borderRadius: 50
  },
  infoContainer: {
    backgroundColor: 'transparent',
    padding: 10,
    paddingBottom: 3
  },
  id: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.5)',
    paddingBottom: 2
  },
  name: {
    color: '#444',
    textAlign: 'center',
    fontSize: 15
  }
});
