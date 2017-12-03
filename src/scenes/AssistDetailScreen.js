import React from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { Theme } from '../themes/styles';
import PropTypes from 'prop-types';
import AssistDetailItem from '../components/assist/AssistDetailItem';
import AssistHeader from '../components/assist/AssistHeader';
import { _ } from '../modules/i18n/Translator';

const TAG = 'AssistDetailScreen';
export default class AssistDetailScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: _('Mis Asistencias'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
    ]
  });

  state = {};

  renderItem = ({ item, index }) => {
    return <AssistDetailItem detail={item} />;
  };

  renderHeader = () => {
    let { assist } = this.getParams();
    return <AssistHeader assist={assist} />;
  };

  getParams() {
    let { state } = this.props.navigation;
    return state.params || {};
  }

  render() {
    let paddingTop = Platform.OS === 'ios' ? 65 : 60;
    let { assist } = this.getParams();

    return (
      <View style={[styles.container]}>
        <FlatList
          data={assist.DETALLE || []}
          contentContainerStyle={[{ paddingTop }]}
          renderItem={this.renderItem}
          ListHeaderComponent={this.renderHeader}
          keyExtractor={(item, index) => {
            return index;
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
