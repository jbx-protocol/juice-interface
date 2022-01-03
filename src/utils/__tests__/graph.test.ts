import { formatGraphQuery } from '../graph'

test('format basic queries', () => {
  const query = formatGraphQuery({
    entity: 'project',
    keys: ['id', 'creator', 'uri'],
  })

  expect(query).toBe('{ projects { id creator uri } }')
})

test('format with first & skip', () => {
  const query = formatGraphQuery({
    entity: 'project',
    keys: ['id', 'creator', 'uri'],
    first: 100,
    skip: 10,
  })

  expect(query).toBe('{ projects(first: 100, skip: 10) { id creator uri } }')
})

test('format with single where', () => {
  const query = formatGraphQuery({
    entity: 'project',
    keys: ['id', 'creator', 'uri'],
    where: {
      key: 'id',
      value: '1',
    },
  })

  expect(query).toBe('{ projects(where: { id: "1" }) { id creator uri } }')
})

test('format with multiple where', () => {
  const query = formatGraphQuery({
    entity: 'project',
    keys: ['id', 'creator', 'uri'],
    where: [
      {
        key: 'id',
        value: '1',
      },
      {
        key: 'creator',
        value: '123',
      },
    ],
  })

  expect(query).toBe(
    '{ projects(where: { id: "1", creator: "123" }) { id creator uri } }',
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
