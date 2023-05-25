import { SPLITS_PAYER_ADDRESS_EXPLANATION } from 'components/strings'
import { LaunchSplitsPayerButton } from './LaunchSplitsPayerButton'

export function SplitsPayerSection() {
  // TODO: JB-161
  // const [projectPayersModalIsVisible, setProjectPayersModalIsVisible] =
  //   useState<boolean>()

  // const { data: splitsPayers } = useSplitsPayers(projectId)

  return (
    <>
      <p>{SPLITS_PAYER_ADDRESS_EXPLANATION}</p>
      <div className="flex flex-wrap">
        <LaunchSplitsPayerButton />
        {/* TODO: JB-161 */}
        {/* {splitsPayers && (
          <>
            <Button
              // onClick={() => setProjectPayersModalIsVisible(true)}
              size="small"
            >
              {plural(projectPayers.length, {
                one: 'View deployed splits payer address',
                other: 'View deployed splits payer addresses',
              })}
            </Button>
            <SplitsPayerAddressesModal
              open={projectPayersModalIsVisible}
              onCancel={() => setProjectPayersModalIsVisible(false)}
              projectPayers={projectPayers}
            />
          </>
        )} */}
      </div>
    </>
  )
}
