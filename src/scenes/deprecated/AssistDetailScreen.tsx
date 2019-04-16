import * as React from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { Color, Theme } from '../../themes/styles';
import * as PropTypes from 'prop-types';
import AssistDetailItem from '../../components/assist/AssistDetailItem';
import AssistHeader from '../../components/assist/AssistHeader';
import { _ } from '../../modules/i18n/Translator';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions,
} from 'react-navigation';

export interface AssistDetailScreenProps {
  navigation: NavigationScreenProp<any, any>;
}

export interface State {}

const TAG = 'AssistDetailScreen';
export default class AssistDetailScreen extends React.Component<
  AssistDetailScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
  };

  static navigationOptions: NavigationStackScreenOptions = {
    title: _('Mis Asistencias'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault,
    ],
  };

  state: State = {};

  renderItem = ({ item, index }: ListRenderItemInfo<any>) => {
    return <AssistDetailItem detail={item} />;
  };

  renderHeader = () => {
    const { assist } = this.getParams();
    return <AssistHeader assist={assist} />;
  };

  getParams(): any {
    const { params } = this.props.navigation.state || { params: {} };
    return params;
  }

  render() {
    const { assist } = this.getParams();

    return (
      <View style={[styles.container]}>
        <FlatList
          showsVerticalScrollIndicator={true}
          data={assist.DETALLE || []}
          renderItem={this.renderItem}
          ListHeaderComponent={this.renderHeader}
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
