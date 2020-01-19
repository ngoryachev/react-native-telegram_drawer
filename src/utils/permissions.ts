import {Permission, PermissionsAndroid, Platform} from 'react-native';

type RequestPermissionProps = {
  permission: Permission;
  title: string;
  message: string;
};

export const READ_STORAGE = {
  permission: PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  title: 'Read Storage Access',
  message: 'To open gallery please gave access',
};

export const requestPermission = async ({
  permission,
  title,
  message,
}: RequestPermissionProps) => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const already = await PermissionsAndroid.check(permission);
  if (already) {
    return true;
  }

  const result = await PermissionsAndroid.request(permission, {title, message, buttonPositive: 'OK'});
  if (result === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  throw result;
};
