import jsonData from './domains.json'

export const useDomains = () => {
  let id = 0

  const uniqueData = Array.from(new Set(jsonData.map((item) => item.Domains)))

  return uniqueData.map((item) => ({
    id: `${id++}`,
    name: `${item}`,
    value: `${item}`,
  }))
}
