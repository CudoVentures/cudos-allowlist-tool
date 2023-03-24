import React from "react"
import { Typography } from "@mui/material"
import { Box } from "@mui/system"
import { LAYOUT_CONTENT_TEXT, SvgComponent } from "./helpers"


const NoResult = () => {
    return (
        <Box gap={2} style={{ marginTop: '50px', paddingBottom: '6rem', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SvgComponent type={LAYOUT_CONTENT_TEXT.MagnifyingGlass} style={{ width: '100%' }} />
            <Typography variant="h5">No result found...</Typography>
            <Typography variant="subtitle1">Please try again with other keywords.</Typography>
        </Box>
    )
}

export default NoResult
