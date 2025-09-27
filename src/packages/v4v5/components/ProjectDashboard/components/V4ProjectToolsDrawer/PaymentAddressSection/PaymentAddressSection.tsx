import { PROJECT_PAYER_ADDRESS_EXPLANATION } from 'components/strings'
import { LaunchProjectPayerButton } from './LaunchProjectPayerButton'

export function PaymentAddressSection() {
  // const { projectId } = useContext(ProjectMetadataContext)

  // const [projectPayersModalIsVisible, setProjectPayersModalIsVisible] =
  //   useState<boolean>()

  // const { data, loading } = useEtherc20ProjectPayersQuery({
  //   client,
  //   variables: {
  //     where: {
  //       projectId,
  //     },
  //   },
  // })

  // const projectPayers = data?.etherc20ProjectPayers

  return (
    <>
      <p>{PROJECT_PAYER_ADDRESS_EXPLANATION}</p>

      <p>
        {/* <Button
          onClick={() => setProjectPayersModalIsVisible(true)}
          size="small"
          type="link"
          className="p-0"
          loading={loading}
          disabled={!projectPayers || projectPayers.length === 0}
        >
          {plural(projectPayers?.length ?? 0, {
            one: 'View deployed project payer address',
            other: 'View deployed project payer addresses',
          })}
        </Button> */}
        {/* <PaymentAddressesModal
          open={projectPayersModalIsVisible}
          onCancel={() => setProjectPayersModalIsVisible(false)}
          projectPayers={projectPayers}
        /> */}
      </p>

      <LaunchProjectPayerButton />
    </>
  )
}
