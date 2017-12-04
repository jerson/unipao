import React from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';
import { Theme } from '../themes/styles';
import PropTypes from 'prop-types';
import Request from '../modules/network/Request';
import Log from '../modules/logger/Log';
import NewsItem from '../components/news/NewsItem';
import Loading from '../components/ui/Loading';
import { _ } from '../modules/i18n/Translator';
import CacheStorage from '../modules/storage/CacheStorage';

const TAG = 'NewsListScreen';
export default class NewsListScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = {
    title: _('Últimas noticias'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.tintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
    ]
  };

  state = {
    newsList: [],
    page: 1,
    isRefreshing: false,
    isLoadingMore: false,
    canLoadMore: true
  };

  load = async () => {
    let { page, isRefreshing, isLoadingMore } = this.state;

    if (!(isRefreshing || isLoadingMore)) {
      this.setState({ isLoading: true, cacheLoaded: false });
    }
    if (page === 1 && !isRefreshing) {
      await this.checkCache();
    }
    await this.loadRequest();
  };
  getCacheKey = () => {
    let { page } = this.state;
    return `newsList_${page}`;
  };
  checkCache = async () => {
    let { page } = this.state;

    try {
      let data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };

  loadResponse = (body, cacheLoaded = false) => {
    let { page } = this.state;
    let newsList = [];
    if (body.data) {
      let data = JSON.parse(body.data);
      if (data.length < 1) {
        this.setState({ canLoadMore: false });
      }
      if (page === 1) {
        newsList = data;
      } else {
        newsList = [...this.state.newsList, ...data];
      }
    }
    this.setState({
      cacheLoaded,
      newsList,
      isLoading: false,
      isRefreshing: false,
      isLoadingMore: false
    });
  };
  loadRequest = async () => {
    let { cacheLoaded, page } = this.state;

    try {
      let limit = 10;
      let start = (page - 1) * limit;
      let end = start + limit - 1;
      let response = await Request.post(
        'pr/listanot',
        {
          v_fin: end,
          v_ini: start
        },
        { secure: true }
      );

      let { body } = response;
      this.loadResponse(body);
      CacheStorage.set(this.getCacheKey(), body);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        this.loadResponse({});
      } else {
        this.setState({
          isLoading: false,
          isRefreshing: false,
          isLoadingMore: false
        });
      }
    }
  };
  renderItem = ({ item, index }) => {
    return <NewsItem news={item} />;
  };
  onRefresh = () => {
    this.setState({ isRefreshing: true, page: 1 }, () => {
      this.load();
    });
  };

  loadNext = () => {
    let page = this.state.page + 1;
    this.setState({ isLoadingMore: true, page }, () => {
      this.load();
    });
  };

  onEndReached = () => {
    let { isLoadingMore, canLoadMore, isLoading } = this.state;
    if (!canLoadMore || isLoadingMore || isLoading) {
      return;
    }
    this.loadNext();
  };

  componentDidMount() {
    this.load();
  }

  render() {
    let { isLoading, isRefreshing, newsList } = this.state;
    let paddingTop = Platform.OS === 'ios' ? 65 : 60;
    return (
      <View style={[styles.container, { paddingTop }]}>
        {/*<Background />*/}
        {isLoading && <Loading margin />}
        <FlatList
          data={newsList}
          renderItem={this.renderItem}
          onEndReached={this.onEndReached}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this.onRefresh}
            />
          }
          keyExtractor={item => {
            return item.IDNOTICIA;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
