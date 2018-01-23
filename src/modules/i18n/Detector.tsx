import * as DeviceInfo from 'react-native-device-info';

export function getDefaultLocale(): string {
    return DeviceInfo.getDeviceLocale();
}
