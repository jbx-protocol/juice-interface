import { formatGraphQuery } from '../graph'

test('format basic queries', () => {
  const query = formatGraphQuery({
    entity: 'project',
    keys: ['id', 'pv', 'metadataUri'],
  })

  expect(query).toBe('{ projects { id pv metadataUri } }')
})

test('format with first & skip', () => {
  const query = formatGraphQuery({
    entity: 'project',
    keys: ['id', 'pv', 'metadataUri'],
    first: 100,
    skip: 10,
  })

  expect(query).toBe('{ projects(first: 100, skip: 10) { id pv metadataUri } }')
})

test('format with single where', () => {
  const query = formatGraphQuery({
    entity: 'project',
    keys: ['id', 'pv', 'metadataUri'],
    where: {
      key: 'id',
      value: '1',
    },
  })

  expect(query).toBe('{ projects(where: { id:"1" }) { id pv metadataUri } }')
})

test('format with multiple where', () => {
  const query = formatGraphQuery({
    entity: 'project',
    keys: ['id', 'pv', 'metadataUri'],
    where: [
      {
        key: 'id',
        value: '1',
      },
      {
        key: 'pv',
        value: '123',
      },
    ],
  })

  expect(query).toBe(
    '{ projects(where: { id:"1", pv:"123" }) { id pv metadataUri } }',
  )
})

test('format nested entitites', () => {
  const query = formatGraphQuery({
    entity: 'project',
    keys: [
      'id',
      {
        entity: 'participant',
        keys: ['id'],
      },
    ],
  })

  expect(query).toBe('{ projects { id participant { id } } }')
})
