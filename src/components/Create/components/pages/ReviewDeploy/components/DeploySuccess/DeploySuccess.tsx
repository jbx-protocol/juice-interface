import { ShareAltOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button } from 'antd'
import { useWallet } from 'hooks/Wallet'
import Image from 'next/image'

export const DeploySuccess = ({ projectId }: { projectId: number }) => {
  console.info('Deploy: SUCCESS', projectId)
  const { chain } = useWallet()
  let deployGreeting = t`Your project has successfully launched!`
  if (chain?.name) {
    deployGreeting = t`Your project has successfully launched on ${chain.name}!`
  }

  return (
    <div
      style={{
        height: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image src="/assets/dancing.gif" width={218} height={218} />
      <div
        style={{
          paddingTop: '30px',
          fontWeight: 500,
          fontSize: '38px',
          lineHeight: '24px',
        }}
      >
        Congratulations!
      </div>
      <div
        style={{
          marginTop: '1.5rem',
          fontWeight: 400,
          fontSize: '18px',
          lineHeight: '34px',
        }}
      >
        {deployGreeting}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '4rem' }}>
        <Button icon={<ShareAltOutlined />}>Share project</Button>
        <Button type="primary">Go to project</Button>
      </div>
    </div>
  )
}
