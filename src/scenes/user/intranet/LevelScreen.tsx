import * as React from 'react';
import { Dimensions, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import * as PropTypes from 'prop-types';
import { _ } from '../../../modules/i18n/Translator';
import { IconType } from '../../../components/ui/Icon';
import FlexibleGrid from '../../../components/ui/FlexibleGrid';
import {
  NavigationScreenConfigProps,
  NavigationScreenProp,
  NavigationStackScreenOptions,
} from 'react-navigation';
import LevelOptionItem from '../../../components/level/LevelOptionItem';
import LevelOptionHeader from '../../../components/level/LevelOptionHeader';
import { Color, Theme } from '../../../themes/styles';

export interface LevelOptionItemModel {
  route: string;
  name: string;
  description?: string;
  icon?: string;
  iconType?: IconType;
}

export interface LevelScreenProps {
  navigation: NavigationScreenProp<any, any>;
}

export interface State {
  items: LevelOptionItemModel[];
}

const TAG = 'LevelScreen';
export default class LevelScreen extends React.Component<
  LevelScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
  };

  static navigationOptions = ({
    navigation,
    screenProps,
  }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
    title: navigation
      ? navigation.state.params!.item.name
      : _('Nivel académico'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault,
    ],
  });
  state: State = {
    items: [
      {
        route: 'HistoryCourses',
        name: _('Historial de cursos'),
        description: _(
          'Cursos de ciclos anteriores, revisa tus notas, silabos y asistencias'
        ),
        icon: 'book',
        iconType: 'Entypo',
      },
      {
        route: 'GradesReport',
        name: _('Reporte de notas'),
        description: _('Reportes de notas de ciclos anteriores'),
        icon: 'ios-paper',
        iconType: 'Ionicons',
      },
      {
        route: 'Enrollment',
        name: _('Ficha de matricula'),
        description: _(
          'Los cursos a los que te inscribiste y cuantos creditos valen'
        ),
        icon: 'folder',
        iconType: 'Entypo',
      },
      {
        route: 'Payments',
        name: _('Historial de pagos'),
        description: _(
          'Todos los pagos realizados incluyendo derechos de tramite'
        ),
        icon: 'monetization-on',
        iconType: 'MaterialIcons',
      },
    ],
  };

  renderItem = ({ item, index }: ListRenderItemInfo<LevelOptionItemModel>) => {
    return (
      <LevelOptionItem
        item={item}
        onChooseItem={() => {
          this.onChooseItem(item);
        }}
      />
    );
  };

  onChooseItem = (option: LevelOptionItemModel) => {
    const { item } = this.getParams();
    this.props.navigation.navigate(option.route, {
      item: option,
      level: item.level,
    });
  };

  renderHeader = () => {
    return <LevelOptionHeader />;
  };
  onDimensionsChange = () => {
    this.forceUpdate();
  };

  getParams(): any {
    const { params } = this.props.navigation.state || { params: {} };
    return params;
  }

  async componentDidMount() {
    Dimensions.addEventListener('change', this.onDimensionsChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onDimensionsChange);
  }

  render() {
    const { items } = this.state;
    const { height } = Dimensions.get('window');

    return (
      <View style={[styles.container]}>
        <FlexibleGrid
          itemWidth={280}
          itemMargin={5}
          showsVerticalScrollIndicator={true}
          data={items}
          contentContainerStyle={[styles.content, { minHeight: height - 150 }]}
          // ListHeaderComponent={this.renderHeader}
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
    backgroundColor: '#f4f4f4',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
