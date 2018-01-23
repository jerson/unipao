import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Theme} from '../../../../themes/styles';
import * as PropTypes from 'prop-types';
import CacheStorage from '../../../../modules/storage/CacheStorage';
import Log from '../../../../modules/logger/Log';
import UPAO from '../../../../scraping/UPAO';
import Loading from '../../../../components/ui/Loading';
import Config from '../../../../scraping/Config';
import NavigationButton from '../../../../components/ui/NavigationButton';
import WebViewDownloader from '../../../../components/ui/WebViewDownloader';

const TAG = 'JobsSectionScreen';
export default class JobsSectionScreen extends React.Component {
    static contextTypes = {
        notification: PropTypes.object.isRequired
    };

    static navigationOptions = ({navigation, screenProps}) => ({
        title: '',
        headerBackTitle: null,
        headerTitleStyle: [Theme.title, Theme.subtitle],
        headerTintColor: Theme.subTintColor,
        headerStyle: [
            Theme.navigationBar,
            Theme.subNavigationBar,
            Theme.shadowDefault
        ],
        headerRight: (
            <View style={{flexDirection: 'row'}}>
                <NavigationButton
                    onPress={() => {
                        navigation.state.params.reload();
                    }}
                    icon={'refresh'}
                    iconType={'MaterialIcons'}
                />
            </View>
        )
    });
    state = {
        isLoading: true
    };
    load = async () => {
        this.setState({isLoading: true, cacheLoaded: false});
        await this.checkCache();
        await this.loadRequest();
    };
    getCacheKey = () => {
        let {section} = this.props;
        return `forum_section_${section.id}`;
    };
    checkCache = async () => {
        try {
            let data = await CacheStorage.get(this.getCacheKey());
            data && this.loadResponse(data, true);
        } catch (e) {
            Log.info(TAG, 'checkCache', e);
        }
    };
    loadResponse = (html, cacheLoaded = false) => {
        this.setState({
            cacheLoaded,
            html,
            isLoading: false
        });
    };
    loadRequest = async () => {
        let {section} = this.props;
        let {cacheLoaded} = this.state;

        try {
            let item = await UPAO.Student.Intranet.Course.getJobsHTML(section);
            this.loadResponse(item);
            CacheStorage.set(this.getCacheKey(), item);
        } catch (e) {
            Log.warn(TAG, 'load', e);
            if (!cacheLoaded) {
                this.loadResponse(null);
            } else {
                this.setState({
                    isLoading: false
                });
            }
        }
    };

    componentWillUnmount() {
        UPAO.abort('Course.getJobsHTML');
    }

    componentDidMount() {
        this.load();
    }

    render() {
        let {html, isRefreshing, isLoading} = this.state;
        return (
            <View style={[styles.container]}>
                {isLoading && <Loading margin/>}
                {!isLoading && (
                    <WebViewDownloader
                        style={[styles.container]}
                        source={{
                            html,
                            baseUrl: Config.URL
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
        backgroundColor: '#ffff'
    }
});
