
import { V4ActivityList } from './V4ActivityList'

export function V4ActivityPanel() {
  // const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()

  return (
    <div className="min-h-[384px] w-full">
      {/* {projectId && (
        <div className="mb-10">
          <Suspense fallback={<LoadingOutlined />}>
            <ErrorBoundaryCallout
              message={<Trans>Volume chart failed to load.</Trans>}
            >
              <VolumeChart
                height={240}
                projectId={projectId}
                createdAt={createdAt}
                pv={PV_V2}
              />
            </ErrorBoundaryCallout>
          </Suspense>
        </div>
      )} */}
      <V4ActivityList />
      {/* <V4DownloadActivityModal
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      /> */}
    </div>
  )
}
