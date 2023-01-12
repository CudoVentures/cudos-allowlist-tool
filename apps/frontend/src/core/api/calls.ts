import axios from 'axios';

import { FetchedAllowlist } from "../store/allowlist";
import { blobToBase64 } from '../../features/allowlists/presentation/components/helpers';

import {
    ALLOWLIST_DETAILS_URL,
    ALLOWLIST_ENTRIES_URL,
    ALLOWLIST_URL,
    ALL_ALLOWLISTS_URL,
    JOIN_ALLOWLIST_URL,
    USER_DETAILS_URL,
    USER_LOGIN_URL
} from './endpoints';

export const GET_ALL_ALLOWLISTS = async (): Promise<FetchedAllowlist[]> => {
    const result = await axios.get(ALL_ALLOWLISTS_URL)
    return result.data
}

export const GET_USER_DETAILS = async () => {
    return axios.get(USER_DETAILS_URL)
}

export const JOIN_ALLOWLIST = async (allowlistID: number, data: any) => {
    return axios.post(JOIN_ALLOWLIST_URL(allowlistID), data)
}

export const GET_ALLOWLIST_DETAILS = async (allowlistID: string) => {
    return axios.get(ALLOWLIST_DETAILS_URL(allowlistID));
}

export const CREATE_ALLOWLIST = async (data: any) => {
    data.image = await blobToBase64(data.image)
    data.banner_image = await blobToBase64(data.banner_image)
    return axios.post(ALLOWLIST_URL, data);
}

export const UPDATE_ALLOWLIST = async (allowlistID: string, data: any) => {
    return axios.put(ALLOWLIST_DETAILS_URL(allowlistID), data);
}

export const GET_ALLOWLIST_ENTRIES = async (allowlistID: number) => {
    return axios.get(ALLOWLIST_ENTRIES_URL(allowlistID));
}

export const LOG_IN_USER = async (data: any) => {
    return axios.post(USER_LOGIN_URL, data);
}