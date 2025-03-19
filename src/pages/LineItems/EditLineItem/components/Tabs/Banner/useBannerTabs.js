import Content from './components/Content.vue'
import Geo from './components/Geo.vue'
import Platform from './components/Platform.vue'
import Time from './components/Time.vue'
import App from './components/App.vue'
import Environment from './components/Environment.vue'
import Exchange from './components/Exchange.vue'
import Video from './components/Video.vue'

export const useBannerTabs = () => {
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
      label: 'Environment',
      value: 'environment',
      component: Environment,
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
      label: 'Video',
      value: 'video',
      component: Video,
    },
  ]

  return { tabs }
}
