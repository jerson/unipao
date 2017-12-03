import React from 'react';
import {
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial
} from '@expo/vector-icons';

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
