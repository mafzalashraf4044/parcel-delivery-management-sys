const defaultState = {
    markers: [],
    markersLimit: 0,
    directions: null,
    loader: false,
    responseMsg: null,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_RESPONSE_MSG':
            return {
                ...state,
                ...action.payload,
            };
        case 'SET_LOADER':
            return {
                ...state,
                ...action.payload,
            };
        case 'SAVE_MARKERS':
            return {
                ...state,
                ...action.payload,
            };
        case 'SAVE_TASKS':
            return {
                ...state,
                ...action.payload,
            };
        case 'SET_MARKERS_LIMIT':
            return {
                ...state,
                ...action.payload,
            };
        case 'SET_DIRECTIONS':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}