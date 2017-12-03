import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import PropTypes from 'prop-types';
import { Theme } from '../../themes/styles';
import Icon from '../ui/Icon';

const TAG = 'IntroItem';
export default class IntroItem extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

  render() {
    let { width, height } = Dimensions.get('window');
    let { item, index } = this.props;
    return (
      <View style={[styles.container, { width }]}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { minHeight: height, paddingTop: 20 }
          ]}
        >
          <View style={styles.block}>
            {item.imageHeader && (
              <View style={[styles.imageContainer, Theme.shadowLarge]}>
                <Image style={[styles.image]} source={item.imageHeader} />
              </View>
            )}
            {index === 0 && (
              <Image
                style={styles.logoName}
                resizeMode={'contain'}
                source={require('../../images/name_alter.png')}
              />
            )}

            {index === 1 && (
              <Icon name={'network'} type={'Entypo'} style={styles.icon} />
            )}

            {index === 2 && (
              <Icon
                name={'newspaper-o'}
                type={'FontAwesome'}
                style={styles.icon}
              />
            )}

            {index === 3 && (
              <Icon
                name={'user'}
                style={styles.icon}
                type={'SimpleLineIcons'}
              />
            )}

            {item.title && (
              <Text style={[styles.text, Theme.textShadow]}>{item.title}</Text>
            )}
            {item.description && (
              <Text style={[styles.subtitle, Theme.textShadow]}>
                {item.description}
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  icon: {
    fontSize: 120,
    alignSelf: 'center',
    marginBottom: 10,
    color: 'rgba(255,255,255,0.8)',
    backgroundColor: 'transparent'
  },
  block: {
    maxWidth: 300,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  logoName: {
    width: 125,
    height: 50,
    marginBottom: 20,
    alignSelf: 'center'
  },
  image: {
    width: 125,
    height: 125
  },
  imageContainer: {
    backgroundColor: '#f59331',
    marginBottom: 5,
    borderRadius: 30
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center'
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 120
  }
});
