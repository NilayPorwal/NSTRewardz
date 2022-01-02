export const ACTION_TYPES = {
  API_PENDING: 'API_PENDING',
  API_SUCCESS: 'API_SUCCESS',
  API_ERROR: 'API_ERROR',
};

export const fetchData = () => ({
  type: ACTION_TYPES.API_PENDING,
});

export const fetchSuccess = (data) => ({
  type: ACTION_TYPES.API_SUCCESS,
  payload: data,
});

export const fetchError = (error) => ({
  type: ACTION_TYPES.API_ERROR,
  payload: error,
});