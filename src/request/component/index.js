import request from "@/request/request";
const API = require("@/apis");

export const musicListCardGetMusicList = config =>request._get(API.MUSIC_LIST_CARD_GET_MUSIC_LIST,config);
export const musicListCardGetMusicsByListId = config =>request._get(API.MUSIC_LIST_CARD_GET_MUSICS_BY_LIST_ID,config);
export const musicListCardFindMusicIfAccessible = config =>request._get(API.MUSIC_LIST_CARD_FIND_MUSIC_IF_ACCESSIBLE,config);
export const musicListCardGetMusicUrl = config =>request._get(API.MUSIC_LIST_CARD_GET_MUSIC_URL,config);
export const musicListCardGetLyricById = config =>request._get(API.MUSIC_LIST_CARD_GET_MUSIC_LYRIC_BY_ID,config);
