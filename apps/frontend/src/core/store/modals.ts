import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface modalState {
    pageTransitionLoading?: boolean
    selectWallet?: boolean
    success?: boolean
    failure?: boolean
}

export const initialState: modalState = {
    pageTransitionLoading: false,
    selectWallet: false,
    success: false,
    failure: false
}

export const modalStateSlice = createSlice({
    name: 'modalState',
    initialState,
    reducers: {
        updateModalState: (state, action: PayloadAction<modalState>) => {
            return { ...state, ...action.payload }
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateModalState } = modalStateSlice.actions

export default modalStateSlice.reducer
