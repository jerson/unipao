import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Touchable from '../ui/Touchable';

const TAG = 'CourseItem';
export default class CourseItem extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state = {};

  onPress = () => {
    let { course } = this.props;
    this.props.navigation.navigate('Course', { course });
  };

  render() {
    let { course } = this.props;
    return (
      <Touchable onPress={this.onPress}>
        <View style={[styles.container]}>
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
            <Text style={styles.title}>{course.name}</Text>
            <Text style={styles.percent}>{course.nrc}</Text>
          </View>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderColor: '#f4f4f4',
    borderBottomWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageContainer: {
    padding: 5,
    paddingLeft: 0,
    position: 'relative',
    justifyContent: 'center'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2
  },
  imagePlaceholder: {
    position: 'absolute',
    left: 0,
    width: 50,
    height: 50,
    borderRadius: 50 / 2
  },
  infoContainer: {
    paddingLeft: 5,
    flex: 1
  },
  title: {
    fontSize: 13,
    color: '#555'
    // fontWeight: 'bold'
  },
  percent: {
    fontSize: 11,
    color: '#ff9e30',
    fontWeight: 'bold'
  }
});
