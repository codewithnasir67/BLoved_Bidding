const initialState = {
  isLoading: true,
  conversations: [],
  messages: [],
  error: null,
};

export const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "getAllConversationsRequest":
      return {
        ...state,
        isLoading: true,
      };
    case "getAllConversationsSuccess":
      return {
        ...state,
        isLoading: false,
        conversations: action.payload,
      };
    case "getAllConversationsFailed":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "getAllMessagesRequest":
      return {
        ...state,
        isLoading: true,
      };
    case "getAllMessagesSuccess":
      return {
        ...state,
        isLoading: false,
        messages: action.payload,
      };
    case "getAllMessagesFailed":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "sendMessageRequest":
      return {
        ...state,
        isLoading: true,
      };
    case "sendMessageSuccess":
      return {
        ...state,
        isLoading: false,
        messages: [...state.messages, action.payload],
      };
    case "sendMessageFailed":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
