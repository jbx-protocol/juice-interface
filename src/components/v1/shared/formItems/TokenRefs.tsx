import { CaretDownFilled, CloseCircleOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { Button, Form, Input } from 'antd'
import { TokenRef } from 'models/token-ref'

import ProjectHandleFormItem from './ProjectHandle/ProjectHandleFormItem'

export default function TokenRefs({
  refs,
  onRefsChange,
}: {
  refs: TokenRef[]
  onRefsChange: (x: TokenRef[]) => void
}) {
  return (
    <div>
      {refs.map((r, i) => (
        <div key={`token_${r.value}`}>
          <div className="flex h-10 items-baseline">
            <Button
              className="mr-5 w-full"
              type="text"
              icon={<CaretDownFilled />}
              onClick={() =>
                onRefsChange(
                  refs.map((_r, _i) =>
                    i === _i
                      ? {
                          type: _r.type === 'erc20' ? 'project' : 'erc20',
                          value: '',
                        }
                      : _r,
                  ),
                )
              }
            >
              {r.type === 'erc20' ? 'ERC-20' : 'Project'}
            </Button>

            <div className="flex-1">
              {r.type === 'erc20' ? (
                <Form.Item>
                  <Input
                    value={r.value}
                    placeholder={constants.AddressZero}
                    onChange={e =>
                      onRefsChange(
                        refs.map((_r, _i) =>
                          i === _i ? { ..._r, value: e.target.value } : _r,
                        ),
                      )
                    }
                  />
                </Form.Item>
              ) : (
                <ProjectHandleFormItem
                  formItemProps={{
                    label: null,
                    initialValue: r.value ? BigNumber.from(r.value) : '',
                  }}
                  requireState="exists"
                  returnValue="id"
                  onValueChange={value =>
                    onRefsChange(
                      refs.map((_r, _i) => (i === _i ? { ..._r, value } : _r)),
                    )
                  }
                />
              )}
            </div>

            {refs.length > 1 && (
              <CloseCircleOutlined
                className="ml-2 flex-shrink"
                onClick={() => onRefsChange(refs.filter((_r, _i) => _i !== i))}
              />
            )}
          </div>
        </div>
      ))}

      <Button
        className="mt-2"
        size="small"
        block
        onClick={() => onRefsChange([...refs, { type: 'erc20', value: '' }])}
      >
        Add
      </Button>
    </div>
  )
}
