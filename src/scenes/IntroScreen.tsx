import * as React from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View
} from 'react-native';
import IntroItem from '../components/intro/IntroItem';
import Button from '../components/ui/Button';
import { _ } from '../modules/i18n/Translator';
import RouterUtil from '../modules/util/RouterUtil';
import Background from '../components/ui/Background';
import LinearGradient from '../components/ui/LinearGradient';
import { NavigationScreenProp } from 'react-navigation';

export interface IntroScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface IntroPage {
  title: string;
  description: string;
  imageHeader?: any;
}

export interface State {
  currentPage: number;
  width: number;
  pages: IntroPage[];
}

export default class IntroScreen extends React.Component<
  IntroScreenProps,
  State
> {
  state: State = {
    currentPage: 0,
    width: Dimensions.get('window').width,
    pages: [
      {
        imageHeader: require('../images/icon.png'),
        title: _('Bienvenido'),
        description: _(
          'Ahora podrás acceder a tu información del campus de la universidad'
        )
      },
      {
        title: _('Accede rapidamente a tu información'),
        description: _(
          'Accede a tus horarios, registro de matriculas y asistencias desde donde estés'
        )
      },
      {
        title: _('Enterate de las últimas noticias'),
        description: _(
          'Las últimas noticias de la universidad para que no te pierdas de nada'
        )
      },
      {
        title: _('Inicia sesión para comenzar'),
        description: _('Estas listo, ahora solo tienes que iniciar sesión')
      }
    ]
  };

  refs: any;

  renderItem = ({ item, index }: ListRenderItemInfo<IntroPage>) => {
    let { width } = this.state;
    return <IntroItem item={item} width={width} index={index} />;
  };

  prev = () => {
    let { width, currentPage } = this.state;
    let page = currentPage;
    page--;
    page = page < 0 ? 0 : page;
    this.refs.list &&
      this.refs.list.scrollToOffset({
        offset: page * width
      });
  };

  next = () => {
    let { pages, width, currentPage } = this.state;
    let page = currentPage;
    page++;
    page = page >= pages.length ? 0 : page;
    this.refs.list &&
      this.refs.list.scrollToOffset({
        offset: page * width
      });
  };

  finish = () => {
    RouterUtil.resetTo(this.props.navigation, 'Login');
  };

  onScroll = (e?: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!e) {
      return;
    }
    let { pages, currentPage } = this.state;

    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;
    let newPage = Math.round(contentOffset.x / viewSize.width);

    if (contentOffset.x === 1) {
      this.setState({ width: viewSize.width });
    }

    if (currentPage === newPage) {
      return;
    }
    this.setState({ currentPage: newPage, width: viewSize.width }, () => {
      if (pages.length === newPage) {
        this.finish();
      }
    });
  };

  componentDidMount() {
    setTimeout(() => {
      this.refs.list &&
        this.refs.list.scrollToOffset({
          offset: 1
        });
    }, 100);
  }

  render() {
    let { pages, currentPage } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Background />
        <FlatList
          ref={'list'}
          data={pages}
          style={{ flex: 1 }}
          horizontal
          pagingEnabled
          onScroll={this.onScroll}
          scrollEventThrottle={200}
          showsHorizontalScrollIndicator={false}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
          style={styles.background}
        >
          <View style={styles.content}>
            <View style={styles.subContent}>
              {currentPage !== 0 && (
                <Button
                  style={[styles.button]}
                  onPress={this.prev}
                  label={_('Anterior')}
                  icon={'navigate-before'}
                  iconType={'MaterialIcons'}
                />
              )}

              {currentPage + 1 !== pages.length && (
                <Button
                  style={[styles.button]}
                  onPress={this.next}
                  label={_('Siguiente')}
                  icon={'navigate-next'}
                  iconType={'MaterialIcons'}
                />
              )}
              {currentPage + 1 === pages.length && (
                <Button
                  style={[styles.button]}
                  onPress={this.finish}
                  type={'primary'}
                  label={_('Iniciar sesión')}
                  icon={'user'}
                  iconType={'FontAwesome'}
                />
              )}
            </View>
            <Button onPress={this.finish} type={'link'} label={_('Omitir')} />
          </View>
        </LinearGradient>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  content: {
    maxWidth: 300
  },
  subContent: {
    flexDirection: 'row'
  },
  button: {},
  background: {
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
});
