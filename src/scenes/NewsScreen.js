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
import CacheStorage from '../modules/storage/CacheStorage';
import Log from '../modules/logger/Log';
import UPAO from '../scraping/UPAO';
import Loading from '../components/ui/Loading';

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
  state = {
    news: null,
    isLoading: true
  };
  load = async () => {
    this.setState({ isLoading: true, cacheLoaded: false });
    await this.checkCache();
    await this.loadRequest();
  };
  getCacheKey = () => {
    let { news } = this.getParams();
    return `news_${news.id}`;
  };
  checkCache = async () => {
    try {
      let data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };
  loadResponse = (news, cacheLoaded = false) => {
    this.setState({
      cacheLoaded,
      news,
      isLoading: false
    });
  };
  loadRequest = async () => {
    let { news } = this.getParams();
    let { cacheLoaded } = this.state;

    try {
      let item = await UPAO.Info.News.get(news.id);
      this.loadResponse(item);
      CacheStorage.set(this.getCacheKey(), item);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        this.loadResponse(null);
      } else {
        this.setState({
          isLoading: false
        });
      }
    }
  };

  getParams() {
    let { state } = this.props.navigation;
    return state.params || {};
  }
  componentDidMount() {
    this.load();
  }

  render() {
    let { news, isLoading } = this.state;
    let content = news ? news.content.replace(new RegExp('o:', 'gm'), '') : '';
    let subtitle = news ? news.subtitle : '';
    let { height } = Dimensions.get('window');
    let itemHeight = height / 2;


    return (
      <ScrollView
        style={[styles.container]}
        showsVerticalScrollIndicator={true}
      >
        {isLoading && <Loading margin />}
        {news && (
          <View>
            <View style={styles.header}>
              <Image
                style={[styles.image, { height: itemHeight }]}
                source={{ uri: ImageUtil.asset(news.image) }}
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
                      title: news.title,
                      message: _('Lee esta noticia en UniPAO'),
                      url: 'http://unipao.com/',
                      subject: _('Compartir')
                    };
                    Share.open(options);
                  }}
                >
                  <Text style={[styles.name, Theme.textShadow]}>
                    {news.title.trim()}
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
        )}
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
    marginBottom: 2,
    textAlign: 'justify'
  },
  span: {
    margin: 0,
    padding: 0
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
    padding: 10,
    paddingTop: 0
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
