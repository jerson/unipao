import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from '../components/ui/Icon';
import { Theme } from '../themes/styles';
import PropTypes from 'prop-types';
import Background from '../components/ui/Background';
import Auth from '../modules/session/Auth';
import Button from '../components/ui/Button';
import RouterUtil from '../modules/util/RouterUtil';
import { titleize } from 'underscore.string';
import ImageUtil from '../modules/util/ImageUtil';
import { _ } from '../modules/i18n/Translator';
import { LinearGradient } from 'expo';

const TAG = 'ProfileScreen';
export default class ProfileScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = {
    tabBarLabel: _('Perfíl'),
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name={'user'}
        type={'FontAwesome'}
        style={[Theme.tabTarIcon, { color: tintColor }]}
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
        contentContainerStyle={[styles.content, { minHeight }]}
        style={[styles.container]}
        keyboardShouldPersistTaps={'handled'}
      >
        <StatusBar
          backgroundColor="#0d61ac"
          translucent
          animated
          barStyle="light-content"
        />
        <Background />

        <View style={styles.profile}>
          <View style={[styles.imageContainer, Theme.shadowDefault]}>
            <Image
              style={styles.imagePlaceholder}
              source={require('../images/placeholder.png')}
            />
            <Image
              style={[styles.image]}
              defaultSource={require('../images/placeholder.png')}
              source={{ uri: ImageUtil.getUserImage(user) }}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.name, styles.id, Theme.textShadow]}>
              {user.ID}
            </Text>
            <Text style={[styles.name, Theme.textShadow]}>
              {titleize(user.NOMBRE)}
            </Text>
          </View>
        </View>

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
  container: {},
  content: {
    paddingTop: 20,
    paddingBottom: 70,
    justifyContent: 'center'
  },
  profile: {
    alignItems: 'center',
    padding: 10
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
    color: 'rgba(255,255,255,0.5)',
    paddingBottom: 2
  },
  name: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15
  }
});
