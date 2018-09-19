const host = 'http://127.0.0.1:8080/api';

export default {
  getMenu: `${host}/menu/get`,
  createMenu: `${host}/menu/create`,
  deleteMenu: `${host}/menu/delete`,

  getToken: `${host}/getAccessToken`,
  
  getTag: `${host}/tag/get`,
  createTag: `${host}/tag/create`,
  updateTag: `${host}/tag/update`,
  deleteTag: `${host}/tag/delete`,

  getUser: `${host}/user/get`,
  getUserInfo: `${host}/user/getinfo`,
  getAllUser: `${host}/user/getallinfo`,
};