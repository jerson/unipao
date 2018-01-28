import * as React from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Platform,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';
import { Theme } from '../../themes/styles';
import * as PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';
import DimensionUtil from '../../modules/util/DimensionUtil';
import IntranetItem from '../../components/intranet/IntranetItem';
import IntranetHeader from '../../components/intranet/IntranetHeader';
import Loading from '../../components/ui/Loading';
import NavigationButton from '../../components/ui/NavigationButton';
import {
  NavigationScreenProp,
  NavigationScreenProps,
  NavigationStackScreenOptions
} from 'react-navigation';
import { IconType } from '../../components/ui/Icon';
import FlexibleGrid from '../../components/ui/FlexibleGrid';
import UPAO from '../../scraping/UPAO';
import Emitter from '../../modules/listener/Emitter';

export interface IntranetItemModel {
  route: string;
  name: string;
  level: 'UG' | 'GR' | 'UT' | 'UB';
  description?: string;
  icon?: string;
  disabled?: boolean;
  iconType?: IconType;
}

export interface IntranetScreenProps {
  screenProps: { [key: string]: any };
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  items: IntranetItemModel[];
}

const TAG = 'IntranetScreen';
export default class IntranetScreen extends React.Component<
  IntranetScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state: State = {
    items: [
      {
        route: 'Level',
        name: _('Pregrado'),
        description: _('22 carreras Profesionales'),
        icon: 'user-o',
        level: 'UG',
        iconType: 'FontAwesome'
      },
      {
        route: 'Level',
        name: _('Centro de idiomas'),
        description: _('Inglés, Francés y Portugues'),
        icon: 'language',
        level: 'UB',
        iconType: 'Entypo'
      },
      {
        route: 'Level',
        name: _('Postgrado'),
        description: _('Estudios de Postgrado'),
        icon: 'graduation-cap',
        level: 'GR',
        iconType: 'Entypo'
      },
      {
        route: 'Level',
        name: _('Gente que trabaja'),
        description: _('Plan de estudios actualizados'),
        icon: 'work',
        level: 'UT',
        iconType: 'MaterialIcons'
      }
    ]
  };

  renderItem = ({ item, index }: ListRenderItemInfo<IntranetItemModel>) => {
    return (
      <IntranetItem
        item={item}
        onChooseItem={() => {
          this.onChooseItem(item);
        }}
      />
    );
  };

  onChooseItem = (item: IntranetItemModel) => {
    this.props.screenProps.rootNavigation.navigate(item.route, { item });
  };

  renderHeader = () => {
    return <IntranetHeader />;
  };
  onDimensionsChange = () => {
    this.forceUpdate();
  };
  async componentDidMount() {
    Dimensions.addEventListener('change', this.onDimensionsChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onDimensionsChange);
  }

  render() {
    let { items } = this.state;
    let { height } = Dimensions.get('window');

    return (
      <View style={[styles.container]}>
        <FlexibleGrid
          itemWidth={150}
          itemMargin={5}
          showsVerticalScrollIndicator={true}
          data={items}
          contentContainerStyle={[styles.content, { minHeight: height - 200 }]}
          ListHeaderComponent={this.renderHeader}
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
    backgroundColor: '#f4f4f4'
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
