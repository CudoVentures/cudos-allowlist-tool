import React, { useCallback } from 'react'
import { Box, Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { LAYOUT_CONTENT_TEXT, SvgComponent } from "../../../../core/presentation/components/Layout/helpers"
import { COLORS_DARK_THEME } from '../../../../core/theme/colors'
import { RootState } from '../../../../core/store'
import { isValidStepOne, isValidStepTwo } from './helpers'
import useManipulateAllowlist from '../../../../core/utilities/CustomHooks/useManipulateAllowlist'
import { updateModalState } from '../../../../core/store/modals'

export const STEP_MAPPER = {
    0: LAYOUT_CONTENT_TEXT.StepOne,
    1: LAYOUT_CONTENT_TEXT.StepTwo,
    2: LAYOUT_CONTENT_TEXT.StepThree
}

export const Controls = ({
    currentStep,
    setStep
}: {
    currentStep: number,
    setStep: React.Dispatch<React.SetStateAction<number>>
}): JSX.Element => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { createAllowlist, updateAllowlist } = useManipulateAllowlist()
    const allowlistState = useSelector((state: RootState) => state.allowlistState)
    const { connectedAddress, connectedWallet } = useSelector((state: RootState) => state.userState)

    const isDisabled = useCallback((step: number) => {
        if (STEP_MAPPER[step]) {
            switch (step) {
                case 0:
                    return !isValidStepOne(allowlistState)
                case 1:
                    return !isValidStepTwo(allowlistState)
                case 2:
                    return false
                default:
                    return true
            }
        }
        return true
    }, [allowlistState])

    const handleStep = async (number: number) => {

        if (number < 0 && allowlistState.editMode) {
            navigate(`/${allowlistState.url}`)
        }

        if (number > 2) {
            if (!connectedAddress || !connectedWallet) {
                dispatch(updateModalState({ selectWallet: true }))
                return
            }

            const result = allowlistState.editMode ?
                await updateAllowlist(allowlistState) :
                await createAllowlist(allowlistState)

            // TODO: implement success modal
            return
        }

        if (STEP_MAPPER[number]) {
            setStep(number)
        }
    }

    return (
        <Box width='100%' height='56px'>
            {currentStep > 0 || allowlistState.editMode ?
                <Button
                    variant="outlined"
                    onClick={() => handleStep(currentStep - 1)}
                    sx={{ float: 'left', width: '47%' }}
                >
                    <SvgComponent
                        type={LAYOUT_CONTENT_TEXT.ArrowRight}
                        style={{ rotate: '180deg', color: COLORS_DARK_THEME.PRIMARY_BLUE, marginRight: '10px' }}
                    />
                    Back
                </Button> : null}
            <Button
                disabled={isDisabled(currentStep)}
                variant="contained"
                onClick={() => handleStep(currentStep + 1)}
                sx={{ float: 'right', width: '47%' }}
            >
                {currentStep < 2 ? "Next Step" : allowlistState.editMode ? "Update Allowlist" : "Create Allowlist"}
                <SvgComponent
                    type={currentStep < 2 ?
                        LAYOUT_CONTENT_TEXT.ArrowRight :
                        LAYOUT_CONTENT_TEXT.SmallCheckmark}
                    style={{ marginLeft: '10px' }}
                />
            </Button>
        </Box>
    )
}

const Stepper = ({ step }: { step: number }): JSX.Element => {
    return <SvgComponent type={STEP_MAPPER[step]} style={{ width: '100%' }} />
}

export default Stepper