import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';

export default class Icon extends React.Component {
  render() {
    let { type, name, ...props } = this.props;
    let nameDefault = name;

    switch (type) {
      default:
      case 'MaterialIcons':
        return <MaterialIcons name={nameDefault} {...props} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={nameDefault} {...props} />;

      case 'FontAwesome':
        return <FontAwesome name={nameDefault} {...props} />;

      case 'Feather':
        return <Feather name={nameDefault} {...props} />;

      case 'Zocial':
        return <Zocial name={nameDefault} {...props} />;

      case 'Ionicons':
        return <Ionicons name={nameDefault} {...props} />;

      case 'Foundation':
        return <Foundation name={nameDefault} {...props} />;

      case 'Octicons':
        return <Octicons name={nameDefault} {...props} />;

      case 'Entypo':
        return <Entypo name={nameDefault} {...props} />;

      case 'EvilIcons':
        return <EvilIcons name={nameDefault} {...props} />;
      case 'SimpleLineIcons':
        return <SimpleLineIcons name={nameDefault} {...props} />;
    }
  }
}
