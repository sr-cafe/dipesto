export const BOARDS_URL = '/1/members/me/boards';

export const LISTS_URL = function(id){
	return `/1/boards/${id}/lists`;
};

export const LIST_URL = function(id){
	return `/1/lists/${id}`;
};

export const NEW_CARD_URL = '/1/cards';
export const UPDATE_CARD_URL = function(id){
	return `/1/cards/${id}`;
}
