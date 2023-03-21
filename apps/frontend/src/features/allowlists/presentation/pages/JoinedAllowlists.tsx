import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

import React from 'react'

import { FetchedAllowlist } from "../../../../core/store/allowlist";
import AllowListCarousel from '../components/AllowlistsCarousel'
import CollapsableCarousel from './CollapsableCarousel'

const JoinedAllowlistsPreview = ({ data }: { data: FetchedAllowlist[] }) => {
    return !data.length ? null :
        <CollapsableCarousel
            text='Joined'
            carousel={
                <AllowListCarousel
                    data={data}
                    withCreateBox={false}
                />
            }
        />
}

export default JoinedAllowlistsPreview
