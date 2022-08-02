import axios from "axios";

axios.interceptors.response.use(res => {
    return res.data
})

// 获取模版列表
async function getRepoList() {
    return axios.get('https://api.github.com/users/MuddyPuddlesss/repos')
}

// 获取版本列表
async function getTagList(repo) {
    return axios.get(`https://api.github.com/repos/MuddyPuddlesss/${repo}/tags`)
}

export {
    getRepoList,
    getTagList
}