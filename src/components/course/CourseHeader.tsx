import * as React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import Touchable from '../ui/Touchable';
import DimensionUtil from '../../modules/util/DimensionUtil';
import { CourseModel } from '../../scraping/student/Intranet';

export interface CourseHeaderProps {
  course: CourseModel;
}

export interface State {}

const TAG = 'CourseHeader';
export default class CourseHeader extends React.Component<
  CourseHeaderProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state: State = {};

  onPress = () => {};

  render() {
    let paddingTop = DimensionUtil.getStatusBarPadding();
    let { course } = this.props;
    return (
      <Touchable onPress={this.onPress}>
        <View
          style={[
            styles.container,
            { paddingTop: Platform.OS === 'ios' ? 30 : 10 }
          ]}
        >
          {/*<LinearGradient*/}
          {/*colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)']}*/}
          {/*style={styles.background}*/}
          {/*/>*/}
          <View style={styles.imageContainer}>
            <Image
              style={styles.imagePlaceholder}
              source={require('../../images/placeholder.png')}
            />
            {course.image && (
              <Image
                style={styles.image}
                defaultSource={require('../../images/placeholder.png')}
                source={{ uri: course.image }}
              />
            )}
          </View>

          <View style={[styles.infoContainer]}>
            <Text style={[styles.title]}>{course.name}</Text>
            <Text style={[styles.subtitle]}>{course.nrc}</Text>
          </View>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    height: 100,
    bottom: 0
  },
  container: {
    backgroundColor: '#f4f4f4',
    borderColor: '#dadada',
    borderBottomWidth: 1,
    padding: 10,
    paddingBottom: 20,
    // flexDirection: 'row',
    alignItems: 'center'
  },
  imageContainer: {
    padding: 5,
    paddingLeft: 0,
    position: 'relative',
    justifyContent: 'center'
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2
  },
  imagePlaceholder: {
    position: 'absolute',
    left: 0,
    width: 100,
    height: 100,
    borderRadius: 100 / 2
  },
  infoContainer: {
    paddingLeft: 5,
    alignItems: 'center'
    // flex: 1
  },
  title: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center'
    // fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#0d61ac',
    fontWeight: 'bold'
  }
});
