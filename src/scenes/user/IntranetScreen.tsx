import * as React from 'react';
import { Dimensions, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import * as PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';
import IntranetOptionHeader from '../../components/intranet/IntranetOptionHeader';
import { IconType } from '../../components/ui/Icon';
import FlexibleGrid from '../../components/ui/FlexibleGrid';
import IntranetOptionItem from '../../components/intranet/IntranetOptionItem';

export interface IntranetOptionItemModel {
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
}

export interface State {
  items: IntranetOptionItemModel[];
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

  renderItem = ({
    item,
    index
  }: ListRenderItemInfo<IntranetOptionItemModel>) => {
    return (
      <IntranetOptionItem
        item={item}
        onChooseItem={() => {
          this.onChooseItem(item);
        }}
      />
    );
  };

  onChooseItem = (item: IntranetOptionItemModel) => {
    this.props.screenProps.rootNavigation.navigate(item.route, { item });
  };

  renderHeader = () => {
    return <IntranetOptionHeader />;
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
          contentContainerStyle={[styles.content, { minHeight: height - 150 }]}
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
