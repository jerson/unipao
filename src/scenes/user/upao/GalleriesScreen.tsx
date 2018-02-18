import * as React from 'react';
import {
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';
import { Theme, Color } from '../../../themes/styles';
import * as PropTypes from 'prop-types';
import Log from '../../../modules/logger/Log';
import GalleryItem from '../../../components/gallery/GalleryItem';
import Loading from '../../../components/ui/Loading';
import { _ } from '../../../modules/i18n/Translator';
import CacheStorage from '../../../modules/storage/CacheStorage';
import UPAO from '../../../scraping/UPAO';
import FlexibleGrid from '../../../components/ui/FlexibleGrid';
import { GalleryModel } from '../../../scraping/info/Gallery';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions
} from 'react-navigation';
import AlertMessage from '../../../components/ui/AlertMessage';

export interface GalleriesScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  galleries: GalleryModel[];
  page: number;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  cacheLoaded: boolean;
  canLoadMore: boolean;
}

const TAG = 'GalleriesScreen';
export default class GalleriesScreen extends React.Component<
  GalleriesScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions: NavigationStackScreenOptions = {
    title: _('Galerías'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.tintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
    ]
  };

  state: State = {
    galleries: [],
    page: 1,
    isLoading: true,
    isRefreshing: false,
    isLoadingMore: false,
    cacheLoaded: false,
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
    return `galleries_${page}`;
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

  loadResponse = (data: GalleryModel[], cacheLoaded = false) => {
    let { page } = this.state;
    let galleries: GalleryModel[] = [];
    if (data.length < 1) {
      this.setState({ canLoadMore: false });
    }
    if (page === 1) {
      galleries = data;
    } else {
      galleries = [...this.state.galleries, ...data];
    }

    this.setState({
      cacheLoaded,
      galleries,
      isLoading: false,
      isRefreshing: false,
      isLoadingMore: false
    });
  };
  loadRequest = async () => {
    let { cacheLoaded, page } = this.state;

    try {
      let items = await UPAO.Info.Gallery.getList(page);
      this.loadResponse(items);
      CacheStorage.set(this.getCacheKey(), items);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        this.loadResponse([]);
      } else {
        this.setState({
          isLoading: false,
          isRefreshing: false,
          isLoadingMore: false
        });
      }
    }
  };
  renderItem = ({ item, index }: ListRenderItemInfo<GalleryModel>) => {
    return <GalleryItem gallery={item} />;
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

  componentWillUnmount() {
    UPAO.abort('Gallery.getList');
  }

  componentDidMount() {
    this.load();
  }

  render() {
    let { isLoading, isRefreshing, galleries } = this.state;
    return (
      <View style={[styles.container]}>
        {!isLoading &&
          galleries.length < 1 && (
            <AlertMessage
              type={'warning'}
              title={_('No se encontraron datos')}
            />
          )}
        {isLoading && <Loading margin />}
        <FlexibleGrid
          itemWidth={300}
          itemMargin={0}
          data={galleries}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          renderItem={this.renderItem}
          onEndReached={this.onEndReached}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this.onRefresh}
            />
          }
          keyExtractor={(item: GalleryModel, index) => {
            return item.id;
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
