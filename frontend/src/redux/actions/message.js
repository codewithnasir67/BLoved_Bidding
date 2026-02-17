import axios from "axios";
import { server } from "../../server";

// get all conversations
export const getAllConversations = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllConversationsRequest",
    });

    const { data } = await axios.get(
      `${server}/conversation/get-all-conversation-seller/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "getAllConversationsSuccess",
      payload: data.conversations,
    });
  } catch (error) {
    dispatch({
      type: "getAllConversationsFailed",
      payload: error.response.data.message,
    });
  }
};

// get all messages
export const getAllMessages = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllMessagesRequest",
    });

    const { data } = await axios.get(
      `${server}/message/get-all-messages/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "getAllMessagesSuccess",
      payload: data.messages,
    });
  } catch (error) {
    dispatch({
      type: "getAllMessagesFailed",
      payload: error.response.data.message,
    });
  }
};

// create new message
export const sendMessage = (message) => async (dispatch) => {
  try {
    dispatch({
      type: "sendMessageRequest",
    });

    const { data } = await axios.post(`${server}/message/create-new-message`, message, {
      withCredentials: true,
    });

    dispatch({
      type: "sendMessageSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "sendMessageFailed",
      payload: error.response.data.message,
    });
  }
};
