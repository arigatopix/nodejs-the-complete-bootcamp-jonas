/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  const url = type === 'password' ? 'updatepassword' : 'updateMe';

  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${url}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type.toUpperCase()} updated successfully!`,
      );
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
