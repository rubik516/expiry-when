import { getFirebaseData } from "@/constants/firebase_config";
import { ROOT_URL } from "@/environment";

interface RequestOptions extends RequestInit {}

const request = async (endpoint: string, options: RequestOptions = {}) => {
  const { currentUser } = getFirebaseData();
  if (!currentUser) {
    return;
  }

  const idToken = await currentUser.getIdToken();
  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${idToken}`,
  };

  const requestOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    method: options.method || "GET",
  };

  const url = `${ROOT_URL}/${endpoint}`;
  return await fetch(url, requestOptions);
};

export default request;
