import jsonData from './apps.json'

export const useApps = () => {
  let id = 0

  const uniqueData = Array.from(new Set(jsonData.map((item) => item['App Name'])))

  return uniqueData.map((item) => ({
    id: `${id++}`,
    name: `${item}`,
    value: `${item}`,
  }))
}
