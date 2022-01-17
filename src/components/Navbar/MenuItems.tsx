import { t } from '@lingui/macro'

import React, { useState } from 'react'

import { Collapse, Space } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'

export function ItemDropdown({
  heading,
  dropdownItems,
}: {
  heading: string
  dropdownItems: JSX.Element[]
}) {
  const [activeKey, setActiveKey] = useState<0 | undefined>()
  const iconSize = 12

  // Close dropdown when clicking anywhere in the window
  window.addEventListener('click', () => setActiveKey(undefined), false)

  return (
    <div className="resources-dropdown">
      <Collapse style={{ border: 'none' }} activeKey={activeKey}>
        <CollapsePanel
          style={{
            border: 'none',
          }}
          key={0}
          showArrow={false}
          header={
            <Space
              onClick={e => {
                setActiveKey(activeKey === 0 ? undefined : 0)
                e.stopPropagation()
              }}
            >
              {heading}
              {activeKey === 0 ? (
                <UpOutlined style={{ fontSize: iconSize }} />
              ) : (
                <DownOutlined style={{ fontSize: iconSize }} />
              )}
            </Space>
          }
        >
          {dropdownItems}
        </CollapsePanel>
      </Collapse>
    </div>
  )
}

export function MenuItem({
  text,
  route,
  onClick,
}: {
  text: string
  route?: string
  onClick?: VoidFunction
}) {
  const external = route?.startsWith('http')
  return (
    <a
      className="nav-menu-item hover-opacity"
      href={route}
      onClick={onClick}
      {...(external
        ? {
            target: '_blank',
            rel: 'noreferrer',
          }
        : {})}
    >
      {text}
    </a>
  )
}

export function DropdownItem({
  text,
  route,
  onClick,
}: {
  text: string
  route?: string
  onClick?: VoidFunction
}) {
  return (
    <a className="nav-dropdown-item" href={route} onClick={onClick}>
      {text}
    </a>
  )
}

export const menu = (onClickMenuItems?: VoidFunction) => {
  return (
    <>
      <MenuItem
        text={t`Projects`}
        route="/#/projects"
        onClick={onClickMenuItems}
      />
      <MenuItem
        text={t`FAQ`}
        route={undefined}
        onClick={() => {
          if (onClickMenuItems) onClickMenuItems()
          window.location.hash = '/'
          setTimeout(() => {
            document
              .getElementById('faq')
              ?.scrollIntoView({ behavior: 'smooth' })
          }, 0)
        }}
      />
      <MenuItem
        text={t`Discord`}
        route="https://discord.gg/6jXrJSyDFf"
        onClick={onClickMenuItems}
      />

      <ItemDropdown
        heading="Resources"
        dropdownItems={[
          <DropdownItem
            key="docs"
            text={t`Docs`}
            route="https://docs.juicebox.money"
            onClick={onClickMenuItems}
          />,
          <DropdownItem
            key="blog"
            text={t`Blog`}
            route="https://blog.juicebox.money"
            onClick={onClickMenuItems}
          />,
          <DropdownItem
            key="workspace"
            text={t`Workspace`}
            route="https://juicebox.notion.site/"
          />,
          <DropdownItem
            key="podcast"
            text={t`Podcast`}
            route="https://open.spotify.com/show/4G8ji7vofcOx2acXcjXIa4?si=1e5e6e171ed744e8"
            onClick={onClickMenuItems}
          />,
        ]}
      />
    </>
  )
}
