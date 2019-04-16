import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { Color, Theme } from '../../../../themes/styles';
import * as PropTypes from 'prop-types';
import Log from '../../../../modules/logger/Log';
import Loading from '../../../../components/ui/Loading';
import { _ } from '../../../../modules/i18n/Translator';
import CacheStorage from '../../../../modules/storage/CacheStorage';
import UPAO from '../../../../scraping/UPAO';
import SyllableItem from '../../../../components/syllable/SyllableItem';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions,
} from 'react-navigation';
import { SyllableModel } from '../../../../scraping/student/intranet/Course';
import AlertMessage from '../../../../components/ui/AlertMessage';

export interface CourseSyllableScreenProps {
  navigation: NavigationScreenProp<any, any>;
}

export interface State {
  items: SyllableModel[];
  isLoading: boolean;
  isRefreshing: boolean;
  cacheLoaded: boolean;
}

const TAG = 'CourseSyllableScreen';
export default class CourseSyllableScreen extends React.Component<
  CourseSyllableScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
  };

  static navigationOptions: NavigationStackScreenOptions = {
    title: _('Silabos del curso'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault,
    ],
  };

  state: State = {
    items: [],
    isLoading: false,
    cacheLoaded: false,
    isRefreshing: false,
  };

  load = async () => {
    const { isRefreshing } = this.state;

    if (!isRefreshing) {
      this.setState({ isLoading: true, cacheLoaded: false });
      await this.checkCache();
    }
    await this.loadRequest();
  };
  getCacheKey = () => {
    const { course } = this.getParams();
    return `course_syllables_${course.id || '_'}`;
  };
  checkCache = async () => {
    try {
      const data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };

  loadResponse = (items: SyllableModel[], cacheLoaded = false) => {
    this.setState({
      items,
      cacheLoaded,
      isLoading: false,
      isRefreshing: false,
    });
  };
  loadRequest = async () => {
    const { cacheLoaded } = this.state;

    try {
      const { course } = this.getParams();
      const items = await UPAO.Student.Intranet.Course.getSyllables(course);
      this.loadResponse(items);
      CacheStorage.set(this.getCacheKey(), items);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        this.loadResponse([]);
      } else {
        this.setState({ isLoading: false, isRefreshing: false });
      }
    }
  };
  renderItem = ({ item, index }: ListRenderItemInfo<SyllableModel>) => {
    return <SyllableItem syllable={item} />;
  };
  onRefresh = () => {
    this.setState({ isRefreshing: true }, () => {
      this.load();
    });
  };

  componentWillUnmount() {
    UPAO.abort('Course.getSyllables');
  }

  getParams(): any {
    const { params } = this.props.navigation.state || { params: {} };
    return params;
  }

  componentDidMount() {
    this.load();
  }

  render() {
    const { isLoading, isRefreshing, items } = this.state;
    return (
      <View style={[styles.container]}>
        {!isLoading && items.length < 1 && (
          <AlertMessage
            type={'warning'}
            title={_('No se encontraron silabos')}
          />
        )}
        {isLoading && <Loading margin />}
        <FlatList
          ref={'list'}
          data={items}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this.onRefresh}
            />
          }
          renderItem={this.renderItem}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
