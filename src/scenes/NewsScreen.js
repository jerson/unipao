import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Theme } from '../themes/styles';
import PropTypes from 'prop-types';
import ImageUtil from '../modules/util/ImageUtil';
import HTMLView from 'react-native-htmlview';
import LinearGradient from '../components/ui/LinearGradient';
import Touchable from '../components/ui/Touchable';
import Share from 'react-native-share';
import { _ } from '../modules/i18n/Translator';

const TAG = 'NewsListScreen';
export default class NewsListScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: '',
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
    ]
  });

  getParams() {
    let { state } = this.props.navigation;
    return state.params || {};
  }

  render() {
    let { news } = this.getParams();
    let content = news.CONTENIDO.replace(/(\r\n|\n|\r)/gm, '');
    let subtitle = news.SUBTITULO.replace(/(\r\n|\n|\r)/gm, '')
      .replace(/(<([^>]+)>)/gi, '')
      .trim();
    let { height } = Dimensions.get('window');
    let itemHeight = height / 2;

    return (
      <ScrollView
        style={[styles.container]}
        showsVerticalScrollIndicator={true}
      >
        <View>
          <View style={styles.header}>
            <Image
              style={[styles.image, { height: itemHeight }]}
              source={{ uri: ImageUtil.asset(news.URL1) }}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']}
              style={[
                styles.gradient,
                Platform.OS === 'windows' && {
                  backgroundColor: 'rgba(0,0,0,0.8)'
                },
                Platform.OS !== 'windows'
                  ? { minHeight: 130 }
                  : { minHeight: 90 }
              ]}
            />
            <View style={styles.infoContainer}>
              <Touchable
                onPress={() => {
                  //test
                  let options = {
                    title: news.TITULO,
                    message: _('Lee esta noticia en UniPAO'),
                    url: 'http://unipao.com/',
                    subject: _('Compartir')
                  };
                  Share.open(options);
                }}
              >
                <Text style={[styles.name, Theme.textShadow]}>
                  {news.TITULO.trim()}
                </Text>
              </Touchable>

              <HTMLView
                addLineBreaks={false}
                value={'<p>' + subtitle + '</p>'}
                stylesheet={stylesSubHTML}
              />
            </View>
          </View>

          <View style={styles.contentContainer}>
            <HTMLView
              addLineBreaks={false}
              value={content}
              stylesheet={stylesHTML}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const stylesSubHTML = StyleSheet.create({
  p: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    backgroundColor: 'transparent'
  }
});
const stylesHTML = StyleSheet.create({
  p: {
    color: '#343434',
    marginTop: 2,
    marginBottom: 18,
    textAlign: 'justify'
  },
  div: {
    color: '#343434',
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'justify'
  },
  ul: {
    marginTop: 5,
    marginBottom: 5
  },
  ol: {
    marginTop: 5,
    marginBottom: 5
  },
  strong: {
    color: '#111',
    fontWeight: 'bold'
  }
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4'
  },
  contentContainer: {
    padding: 10
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  name: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 18,
    backgroundColor: 'transparent'
  },
  header: {},
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    paddingBottom: 10
  },
  image: {
    height: 350
  }
});
