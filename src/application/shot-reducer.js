export default function shotReducer(state = {}, actionName, actionData) {
    if (actionName !== 'shot' || state.active !== actionData.area) {
        return state;
    }

    console.log(state, actionName, actionData);
    return {
        ...state
        // @TODO
    };
}
