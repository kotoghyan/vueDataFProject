import Content from './components/Content.vue'
import Geo from './components/Geo.vue'
import Platform from './components/Platform.vue'
import Time from './components/Time.vue'
import Tags from './components/Tags.vue'
import App from './components/App.vue'
import Exchange from './components/Exchange.vue'

export const useCtvTabs = (hasLineItemCreatives) => {
  const tabs = [
    {
      label: 'App/Site',
      value: 'app_site',
      component: App,
    },
    {
      label: 'Content',
      value: 'content',
      component: Content,
    },
    {
      label: 'Exchange',
      value: 'exchange',
      component: Exchange,
    },
    {
      label: 'Geo',
      value: 'geo',
      component: Geo,
    },
    {
      label: 'Platform',
      value: 'platform',
      component: Platform,
    },
    {
      label: 'Time',
      value: 'time',
      component: Time,
    },
    {
      label: 'Tags',
      value: 'tags',
      component: Tags,
      disabled: hasLineItemCreatives,
    },
  ]

  return { tabs }
}
