import { formatGraphQuery } from '../graph'

test('format basic queries', () => {
  const query = formatGraphQuery({
    entity: 'project',
    keys: ['id', 'cv', 'metadataUri'],
  })

  expect(query).toBe('{ projects { id cv metadataUri } }')
})

test('format with first & skip', () => {
  const query = formatGraphQuery({
    entity: 'project',
    keys: ['id', 'cv', 'metadataUri'],
    first: 100,
    skip: 10,
  })

  expect(query).toBe('{ projects(first: 100, skip: 10) { id cv metadataUri } }')
})

test('format with single where', () => {
  const query = formatGraphQuery({
    entity: 'project',
    keys: ['id', 'cv', 'metadataUri'],
    where: {
      key: 'id',
      value: '1',
    },
  })

  expect(query).toBe('{ projects(where: { id:"1" }) { id cv metadataUri } }')
})

test('format with multiple where', () => {
  const query = formatGraphQuery({
    entity: 'project',
    keys: ['id', 'cv', 'metadataUri'],
    where: [
      {
        key: 'id',
        value: '1',
      },
      {
        key: 'cv',
        value: '123',
      },
    ],
  })

  expect(query).toBe(
    '{ projects(where: { id:"1", cv:"123" }) { id cv metadataUri } }',
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
