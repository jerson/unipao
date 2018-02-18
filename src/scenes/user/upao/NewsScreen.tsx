import * as React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Color, Theme } from '../../../themes/styles';
import * as PropTypes from 'prop-types';
import ImageUtil from '../../../modules/util/ImageUtil';
import HTMLView from 'react-native-htmlview';
import Touchable from '../../../components/ui/Touchable';
import Share from 'react-native-share';
import { _ } from '../../../modules/i18n/Translator';
import CacheStorage from '../../../modules/storage/CacheStorage';
import Log from '../../../modules/logger/Log';
import UPAO from '../../../scraping/UPAO';
import Loading from '../../../components/ui/Loading';
import NavigationButton from '../../../components/ui/NavigationButton';
import { NewsDetailModel } from '../../../scraping/info/News';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions
} from 'react-navigation';

export interface NewsListScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  isLoading: boolean;
  cacheLoaded: boolean;
  news?: NewsDetailModel;
}

const TAG = 'NewsListScreen';
export default class NewsListScreen extends React.Component<
  NewsListScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions: NavigationStackScreenOptions = {
    title: '',
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
    ]
  };
  state: State = {
    cacheLoaded: false,
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
  loadResponse = (news?: NewsDetailModel, cacheLoaded = false) => {
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
        this.loadResponse(undefined);
      } else {
        this.setState({
          isLoading: false
        });
      }
    }
  };

  componentWillUnmount() {
    UPAO.abort('News.get');
  }

  getParams(): any {
    let { params } = this.props.navigation.state || { params: {} };
    return params;
  }

  componentDidMount() {
    this.load();
  }

  render() {
    let { news, isLoading } = this.state;
    let content = news
      ? news.content
          .replace(new RegExp('o:', 'gm'), '')
          .replace(/(\r\n|\n|\r)/gm, '')
      : '';
    let subtitle = news ? news.subtitle : '';
    let { height } = Dimensions.get('window');
    let itemHeight = height / 2;

    return (
      <View style={[styles.container]}>
        <ScrollView style={[styles.scroll]} showsVerticalScrollIndicator={true}>
          {isLoading && <Loading margin />}
          {news && (
            <View style={styles.content}>
              <View>
                {news.image && (
                  <Image
                    style={[styles.image, { height: itemHeight }]}
                    source={{ uri: ImageUtil.asset(news.image) }}
                  />
                )}

                <View style={styles.infoContainer}>
                  <Touchable
                    onPress={() => {
                      //test
                      let options = {
                        title: news ? news.title : '',
                        message: _('Lee esta noticia en UniPAO'),
                        url: 'http://unipao.com/',
                        subject: _('Compartir')
                      };
                      Share.open(options);
                    }}
                  >
                    <Text style={[styles.name]}>{news.title}</Text>
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
                  addLineBreaks={true}
                  value={content}
                  stylesheet={stylesHTML}
                />
              </View>
            </View>
          )}
        </ScrollView>
        <NavigationButton
          onPress={() => {
            this.props.navigation.goBack();
          }}
          subMenu
          icon={'arrow-back'}
        />
      </View>
    );
  }
}

const stylesSubHTML = StyleSheet.create({
  p: {
    color: '#999',
    marginTop: 2,
    backgroundColor: 'transparent'
  }
});
const stylesHTML = StyleSheet.create({
  p: {
    color: '#555',
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'justify'
  },
  span: {},
  div: {
    color: '#555',
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
    backgroundColor: '#fff'
  },
  scroll: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    padding: 10,
    paddingTop: 0
  },
  name: {
    color: '#444',
    fontSize: 16,
    backgroundColor: 'transparent'
  },
  content: {
    maxWidth: 600,
    alignSelf: 'center'
  },
  infoContainer: {
    padding: 10
  },
  image: {
    height: 350
  }
});
