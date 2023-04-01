import type { RouteComponentProps } from '@reach/router'
import React from 'react'
import { HomeButton, PageContainer } from '../components'

export const NotFound = (_: RouteComponentProps) => (
  <PageContainer header={<HomeButton />}>404 Page Not Found</PageContainer>
)

export default NotFound
