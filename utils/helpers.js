import { AsyncStorage } from 'react-native';
import { Notifications, Permissions } from 'expo';

const NOTIFICATION_KEY = 'UdaciCards:notifications';

/*
 * UUID generator function.
 * Code taken from an answer on Stackoverflow on how to generate a simple
 * UUID identifier.
 */
export const generateUUID = function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/*
 * Get results data as argument in JSON format and return a JavaScript
 * object.
 */
export const formatResults = function resultsFromAsyncCall(results) {
	// Build a decks object from the JSON string `results`.
	const decks = JSON.parse(results);
	return decks;
}

/*
 * Code taken from the `Notification` lesson in the Udacity React Native course.
 */
export function clearLocalNotification() {
	return AsyncStorage.removeItem(NOTIFICATION_KEY)
		.then(Notifications.cancelAllScheduledNotificationsAsync)
}

function createNotification() {
	return {
		title: 'Remember to study!',
		body: 'Hey, don\'t forget to study today, if you haven\'t already!',
		ios: {
			sound: true
		},
		android: {
			sound: true,
			priority: 'high',
			sticky: false,
			vibrate: true
		}
	}
}

export function setLocalNotification() {
  AsyncStorage.getItem(NOTIFICATION_KEY)
    .then((result) => {
    	const res = JSON.parse(result)
    	return res;
    })
    .then((data) => {
      if (data === null) {
        Permissions.askAsync(Permissions.NOTIFICATIONS)
          .then(({ status }) => {
            if (status === 'granted') {
              Notifications.cancelAllScheduledNotificationsAsync();

              let notificationTime = new Date();
              notificationTime.setDate(notificationTime.getDate() + 1);
              notificationTime.setHours(18);
              notificationTime.setMinutes(0);

              Notifications.scheduleLocalNotificationAsync(
                createNotification(),
                {
                  time: notificationTime,
                  repeat: 'day',
                }
              )
              AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true))
            }
          })
      }
    })
}