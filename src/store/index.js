import {createStore} from 'vuex'
import {mutations} from './mutations'
import {actions} from './actions'
 
export const store = createStore({
    state:{
    },
    getters:{
        // getId(state){
        //     return state.typeId
        // },
        // getUser(state){
        //     return state.user
        // }
    },
    mutations,
    actions
})