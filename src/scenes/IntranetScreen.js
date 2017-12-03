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
import IntranetItem from '../components/intranet/IntranetItem';
import NavigationButton from '../components/ui/NavigationButton';
import IntranetHeader from '../components/intranet/IntranetHeader';
import Loading from '../components/ui/Loading';
import PeriodModal from '../components/period/PeriodModal';
import { _ } from '../modules/i18n/Translator';

const TAG = 'IntranetScreen';
export default class IntranetScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: _('Aula Virtual'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.tintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
    ],
    headerRight: (
      <NavigationButton
        onPress={() => {
          navigation.state.params.reload();
        }}
        icon={'refresh'}
        iconType={'MaterialIcons'}
      />
    )
  });

  state = {
    isLoading: true,
    isRefreshing: false,
    withoutCareer: false,
    career: null,
    periods: [],
    items: [
      {
        route: 'Schedule',
        name: _('Mi Horario'),
        icon: 'schedule',
        iconType: 'MaterialIcons'
      },
      {
        route: 'Assists',
        name: _('Asistencias'),
        icon: 'calendar-check-o',
        iconType: 'FontAwesome'
      },
      {
        route: 'Enrollment',
        name: _('Ficha de matrícula'),
        icon: 'results-demographics',
        iconType: 'Foundation'
      },
      {
        route: 'Payments',
        name: _('Estado de cuenta'),
        icon: 'monetization-on',
        iconType: 'MaterialIcons'
      },
      {
        route: '',
        name: _('Notas por componentes'),
        icon: 'bar-graph',
        disabled: true,
        iconType: 'Entypo'
      },
      {
        route: '',
        name: _('Reporte de Notas'),
        icon: 'line-graph',
        disabled: true,
        iconType: 'Entypo'
      },
      {
        route: '',
        name: _('Mis cursos'),
        icon: 'page-copy',
        disabled: true,
        iconType: 'Foundation'
      },
      {
        route: '',
        name: _('Sílabos'),
        icon: 'book-open-page-variant',
        disabled: true,
        iconType: 'MaterialCommunityIcons'
      }
    ]
  };

  renderItem = ({ item, index }) => {
    return (
      <IntranetItem
        onChooseItem={() => {
          this.onChooseItem(item);
        }}
        intranet={item}
        index={index}
      />
    );
  };
  onChooseCareer = career => {
    if (!career) {
      this.setState({ withoutCareer: true });
    } else {
      this.setState({ career });
    }
  };
  onLoadPeriods = periods => {
    this.setState({ periods, isLoading: false, isRefreshing: false });
  };

  onChooseItem = item => {
    let { career, periods } = this.state;

    if (!career) {
      this.context.notification.show({
        type: 'warning',
        title: _('No has elegido una carrera'),
        icon: 'error-outline',
        autoDismiss: 4,
        iconType: 'MaterialIcons'
      });
      return;
    }
    let period = periods.find(period => {
      return period.NIVEL === career.NIVEL;
    });
    this.props.navigation.navigate(item.route, { career, period });
  };

  reload = () => {
    this.onRefresh();
  };
  onRefresh = () => {
    this.setState({ isRefreshing: true }, () => {
      this.refs.periods.load();
    });
  };
  renderHeader = () => {
    return <IntranetHeader onChooseCareer={this.onChooseCareer} />;
  };

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
  }

  render() {
    let paddingTop = Platform.OS === 'ios' ? 65 : 60;
    let { items, isRefreshing, withoutCareer, isLoading } = this.state;
    return (
      <View style={[styles.container, { paddingTop }]}>
        <PeriodModal ref={'periods'} onLoaded={this.onLoadPeriods} />
        {/*<Background/>*/}
        {isLoading && <Loading margin />}

        {!isLoading && (
          <FlatList
            data={items}
            ListHeaderComponent={this.renderHeader}
            renderItem={this.renderItem}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this.onRefresh}
              />
            }
            keyExtractor={(item, index) => {
              return index;
            }}
          />
        )}
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
